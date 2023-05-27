import base64
import math
import secrets
import hashlib
import random

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
  '/', '/auth/login', '/auth/register', 'auth/refresh',
  '/auth/isavailable', '/auth/verify_email', '/auth/verify_email/send',
  '/openapi.json', '/docs', '/redoc'
]

@app.middleware("http")
async def token_middleware(request: Request, call_next):
  print(request['path'])
  if request['path'].lower().removesuffix('/') in open_endpoints:
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
  return {"woof": "awoo"}


##### Auth #####

@app.get('/auth/isavailable')
async def is_available(response: Response, username: str = None, email: str = None):
  if username is not None and email is not None:
    response.status_code = 400
    return {"message": "Provide either email or username, not both"}
  if username is not None:
    exists = db['users'].find_one(find_user_from_name(username)) is not None
    if exists:
      response.status_code = 409
      return {"message": "Username taken"}
    return {"message": "Username available"}
  if email is not None:
    exists = db['users'].find_one(find_user_from_email(email)) is not None
    if exists:
      response.status_code = 409
      return {"message": "Email taken"}
    return {"message": "Email available"}
  response.status_code = 400
  return {"message": "Provide either email or username"}

@app.post('/auth/verify_email')
async def verify_email(response: Response, user: str = "", code: str = ""):
  timestamp: int = math.floor(datetime.now().timestamp() * 1000)
  doc = db['email-verification'].find_one(find_email_verification(user), {"_id": 0})
  email, digits = (doc["email"], str(doc["code"])) if doc is not None else ("asd", "fgh")
  expected = await get_email_code(email, digits)
  print(expected)
  if not secrets.compare_digest(expected, bytes(code, "utf-8")) or doc is None or timestamp >= doc["expires_at"]:
    response.status_code = 400
    if doc is not None:
      db['email-verification'].update_one(
        find_email_verification(user),
        {
          "$inc": {"attempts": 1}
        }
      )
    if doc is not None and doc["attempts"] >= 5:
      response.status_code = 401
      return {"error": "Too many attempts!"}
    return {"error": "Invalid username or code"}
  
  db['users'].update_one(
    find_user_from_name(user),
    { "$set": {"verified": True} }
  )
  db['email-verification'].delete_one(find_user_from_name(user))
  return {"message": "Verified successfully!"}
  
@app.post('/auth/verify_email/send')
async def send_verification_email(response: Response, username: str = "", email: str = ""):
  timestamp: int = math.floor(datetime.now().timestamp() * 1000)
  user = db['users'].find_one(find_user_from_name(username))
  if user is None or user["email"] != email.lower() or user["verified"]:
    response.status_code = 400
    return {"error": "Invalid username or email, or already verified. Wait one minute between sending emails."}
  
  doc = db['email-verification'].find_one(find_email_verification(username), {"_id": 0})
  if doc is None:
    db['email-verification'].insert_one({
      "username": user["username"],
      "email": user["email"],
      "attempts": 0,
      "code": secrets.randbelow(900_000) + 100_000,
      "created_at": timestamp,
      "expires_at": timestamp + 1_200_000
    })
  else:
    if doc["created_at"] > timestamp - 60_000:
      response.status_code = 400
      return {"error": "Invalid username or email, or already verified. Wait one minute between sending emails."}
    db['email-verification'].update_one(
      find_email_verification(username),
      {"$set": {
        "attempts": 0,
        "code": secrets.randbelow(900_000) + 100_000,
        "created_at": timestamp,
        "expires_at": timestamp + 1_200_000
      }}
    )
  
  #TODO: send email
  return {"message": "Email sent"}
  
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

async def get_email_code(email: str, digits: str):
  return base64.b64encode(hashlib.sha256(bytes(email + digits, "utf-8")).digest())


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
