from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import base64
import os
from dotenv import load_dotenv

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

redirect_uri = 'http://localhost:5173'
client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')
combined = client_id + ":" + client_secret
encoded = base64.b64encode(combined.encode("ascii")).decode("ascii")

@app.post('/login')
async def login(code: str = ""):
    res = requests.post(
        url = "https://accounts.spotify.com/api/token",
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri,
        },
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + encoded,
        },
    )
    res_json: dict = res.json()
    if res.status_code != 200:
        raise HTTPException(status_code=res.status_code, detail= res_json)
    return res_json

@app.post('/refresh')
async def refresh(refresh_token):
    res = requests.post(
        url = "https://accounts.spotify.com/api/token",
        data = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
        },
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + encoded,
        }
    )
    res_json: dict = res.json()
    if res.status_code != 200:
        raise HTTPException(status_code=res.status_code, detail= res_json)
    return res_json
