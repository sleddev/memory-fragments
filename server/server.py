import base64
import math
import secrets
import hashlib
import re

from typing import Literal
from datetime import datetime

from fastapi import FastAPI, Request, Response
from pydantic import BaseModel
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

access_token_expiry = 3_600_000 # one hour
verify_email_expiry = 1_200_000 # 20 minutes

##### Middleware #####

open_endpoints = [
  '/', '/auth/login', '/auth/register', '/auth/refresh',
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

class VerifyEmailBody(BaseModel):
  username: str = ""
  code: str = ""
@app.post('/auth/verify_email')
async def verify_email(response: Response, body: VerifyEmailBody = None):
  timestamp: int = math.floor(datetime.now().timestamp() * 1000)
  if body is None:
    response.status_code = 400
    return {"error": "Invalid request body"}
  doc = db['email-verification'].find_one(find_email_verification(body.username), {"_id": 0})
  email, digits = (doc["email"], str(doc["code"])) if doc is not None else ("asd", "fgh")
  expected = await get_email_code(email, digits)
  print(expected)
  if not secrets.compare_digest(expected, bytes(body.code, "utf-8")) or doc is None or timestamp >= doc["expires_at"]:
    response.status_code = 400
    if doc is not None:
      db['email-verification'].update_one(
        find_email_verification(body.username),
        {
          "$inc": {"attempts": 1}
        }
      )
    if doc is not None and doc["attempts"] >= 5:
      response.status_code = 401
      return {"error": "Too many attempts!"}
    return {"error": "Invalid username or code"}
  
  db['users'].update_one(
    find_user_from_name(body.username),
    { "$set": {"verified": True} }
  )
  db['email-verification'].delete_one(find_user_from_name(body.username))
  return {"message": "Verified successfully!"}
  
class SendEmailBody(BaseModel):
  username: str = ""
  email: str = ""
@app.post('/auth/verify_email/send')
async def send_verification_email(response: Response, body: SendEmailBody = None):
  timestamp: int = math.floor(datetime.now().timestamp() * 1000)
  if body is None:
    response.status_code = 400
    return {"error": "Invalid request body"}
  user = db['users'].find_one(find_user_from_name(body.username))
  if user is None or user["email"] != body.email.lower() or user["verified"]:
    response.status_code = 400
    return {"error": "Invalid username or email, or already verified. Wait one minute between sending emails."}
  
  doc = db['email-verification'].find_one(find_email_verification(body.username), {"_id": 0})
  if doc is None:
    db['email-verification'].insert_one({
      "username": user["username"],
      "email": user["email"],
      "attempts": 0,
      "code": secrets.randbelow(900_000) + 100_000,
      "created_at": timestamp,
      "expires_at": timestamp + verify_email_expiry
    })
  else:
    if doc["created_at"] > timestamp - 60_000:
      response.status_code = 400
      return {"error": "Invalid username or email, or already verified. Wait one minute between sending emails."}
    db['email-verification'].update_one(
      find_email_verification(body.username),
      {"$set": {
        "attempts": 0,
        "code": secrets.randbelow(900_000) + 100_000,
        "created_at": timestamp,
        "expires_at": timestamp + verify_email_expiry
      }}
    )
  #TODO: send email
  return {"message": "Email sent"}
  
class RegisterBody(BaseModel):
  username: str = None
  display_name: str = None
  password: str = None
  email: str = None
@app.post('/auth/register')
async def register(response: Response, body: RegisterBody = None):
  timestamp: int = math.floor(datetime.now().timestamp() * 1000)
  
  if body is None or body.username is None or body.display_name is None \
    or body.password is None or body.email is None:
    response.status_code = 400
    return {"error": "Invalid request body"}
  if db['users'].find_one(find_user_from_name(body.username)) is not None:
    response.status_code = 409
    return {"error": "Username taken"}
  if db['users'].find_one(find_user_from_email(body.email)) is not None:
    response.status_code = 409
    return {"error": "Email taken"}
  if re.fullmatch(r"[^@]+@[^@]+\.[^@]+", body.email) is None:
    response.status_code = 400
    return {"error": "Invalid email address"}
  
  db['users'].insert_one({
    "username": body.username,
    "display_name": body.display_name,
    "password": base64.encodebytes(hashlib.scrypt(
      bytes(body.password, "utf-8"),
      salt=bytes(server_secret + body.username, "utf-8"),
      n=8192, r=24, p=1,dklen=64
    )).decode("utf-8"),
    "email": body.email,
    "verified": False,
    "preferences": {},
    "images": {
      "profile_pic": "",
      "banner": ""
    },
    "created_at": timestamp,
    "last_login": 0,
    "refresh_tokens": []
  })
  response.status_code = 201
  return {"message": "Registered successfully"}

class LoginBody(BaseModel):
  username: str = None
  password: str = None
@app.post('/auth/login')
async def login(response: Response, body: LoginBody = None):
  timestamp: int = math.floor(datetime.now().timestamp() * 1000)

  if body is None or body.username is None or body.password is None:
    response.status_code = 400
    return {"error": "Invalid request body"}
  user = db['users'].find_one(find_user_from_name(body.username))
  pass_hash = base64.encodebytes(hashlib.scrypt(
    bytes(body.password, "utf-8"),
    salt=bytes(server_secret + body.username, "utf-8"),
    n=8192, r=24, p=1,dklen=64
  )).decode("utf-8")
  if user is None or not secrets.compare_digest(pass_hash, user["password"]):
    response.status_code = 401
    return {"error": "Invalid username or password"}
  if not user["verified"]:
    response.status_code = 401
    return {"error": "Email verification needed"}
  
  refresh_token, refresh_timestamp = await generate_token(body.username, "refresh")
  access_token, access_timestamp = await generate_token(body.username, "access")
  db['users'].update_one(
    find_user_from_name(body.username),
    {
      "$set": { "last_login": timestamp },
      "$push": { "refresh_tokens": {
        "token": refresh_token,
        "created_at": refresh_timestamp,
        "access_tokens": [{
          "token": access_token,
          "created_at": access_timestamp,
          "expires_at": access_timestamp + access_token_expiry
        }]
      }}
    }
  )
  return {
    "refresh_token": refresh_token,
    "access_token": access_token,
    "expires_at": access_timestamp + access_token_expiry
  }

class RefreshBody(BaseModel):
  refresh_token: str = None
@app.post('/auth/refresh')
async def refresh(response: Response, body: RefreshBody = None):
  timestamp: int = math.floor(datetime.now().timestamp() * 1000)
  if body is None or body.refresh_token is None:
    response.status_code = 400
    return {"error": "Invalid request body"}
  user = db['users'].find_one(find_user_from_refresh_token(body.refresh_token))
  if user is None:
    response.status_code = 401
    return {"error": "Invalid refresh token"}
  access_token, access_timestamp = await generate_token(user["username"])
  db['users'].update_one(
    {
      "username": user["username"],
      "refresh_tokens.token": body.refresh_token
    },
    { "$push": {"refresh_tokens.$.access_tokens": {
      "token": access_token,
      "created_at": access_timestamp,
      "expires_at": access_timestamp + access_token_expiry
    }} }
  )
  return {
    "token": access_token,
    "created_at": access_timestamp,
    "expires_at": access_timestamp + access_token_expiry
  }

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
