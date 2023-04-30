import base64
import math
import secrets
import hashlib

from typing import Literal
from datetime import datetime

from fastapi import FastAPI, Request, Response
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import dotenv_values

from filters_pipelines import *

env = dotenv_values(".env")
app = FastAPI()

server_secret = env["SERVER_SECRET"]
mongo_uri = env["MONGO_URI"]

mongo = MongoClient(mongo_uri, server_api=ServerApi('1'))
db = mongo[env["DATABASE_NAME"]]

##### Middleware #####

open_endpoints = [
  '/', '/auth/login', '/auth/register',
  '/openapi.json', '/docs', '/redoc'
]

@app.middleware("http")
async def token_middleware(request: Request, call_next):
  if request['path'] in open_endpoints:
    return await call_next(request)
  token_status = await verify_token((request.headers.get("Authorization") or "").split(' ')[-1])
  if token_status == "notfound" or token_status == "invalid":
    return Response('{"message": "Invalid access token"}', status_code=401)
  if token_status == "expired":
    return Response('{"message": "Access token expired"}', status_code=401)
  else: return await call_next(request)


##### General #####

@app.get("/")
async def awoo():
  return "woof"


##### Auth #####

@app.post('/auth/register')
async def register():
  pass

@app.post('/auth/login')
async def register():
  pass

@app.post('/auth/refresh')
async def refresh():
  pass

async def get_token_signature(username: str, creation_time: int, token_type: Literal["access", "refresh"] = "access"):
  root_string: str = str(creation_time) + username + server_secret
  if token_type == "refresh":
    root_string += "refresh"
  length: int = 32 if token_type == "refresh" else 24
  signature: str = base64.b64encode(hashlib.sha256(bytes(root_string, "utf-8"), usedforsecurity=True).digest()).decode('ascii')[:length]
  return signature

async def generate_token(username: str, token_type: Literal["access", "refresh"] = "access"):
  creation_time: int = math.floor(datetime.now().timestamp() * 1000)
  # 64 and 48 base64 characters respectively
  n_bytes: int = 48 if token_type == "refresh" else 36
  token_base: str = base64.b64encode(secrets.token_bytes(n_bytes)).decode('ascii')
  signature: str = await get_token_signature(username, creation_time, token_type)
  token = token_base + signature
  return token, creation_time

async def verify_token_signature(token: str, username: str, creation_time: int, token_type: Literal["access", "refresh"] = "access"):
  length: int = 32 if token_type == "refresh" else 24
  signature = token[-length:]
  expected_signature = await get_token_signature(username, creation_time, token_type)
  return secrets.compare_digest(signature, expected_signature)

async def verify_token(token: str, token_type: Literal["access", "refresh"] = "access")-> Literal["valid", "notfound", "invalid", "expired"]:
  if token_type == "access": user = db['users'].find_one(find_user_from_token(token))
  else: user = db['users'].find_one(find_user_from_refresh_token(token))
  if user is None: return "invalid"
  token_obj = db['users'].aggregate(aggregate_access_token(token)).next() if token_type == "access" \
    else db['users'].aggregate(aggregate_refresh_token(token)).next()
  current_time: int = math.floor(datetime.now().timestamp() * 1000)
  if current_time > token_obj['expires_at']: return "expired"
  
  if not await verify_token_signature(
    token, user['username'], token_obj['created_at'], token_type
  ): return "invalid"
  return "valid"


##### Me #####

@app.get('/me')
async def me(request: Request):
  return db['users'].find_one(
    find_user_from_token(request.headers.get('Authorization').split(' ')[-1]),
    {
      '_id': 0,
      'password': 0,
      'refresh_tokens': 0
    }
  )
