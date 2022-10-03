from json import JSONEncoder
from fastapi import FastAPI, HTTPException, Header, Response, Request
from  fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import base64
import os
from dotenv import load_dotenv
from spotifydl import login_from_stored, check_premium, download_track
from librespot.audio.decoders import AudioQuality
from pathlib import Path
import builtins

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

BYTES_PER_RESPONSE = 1024*100

redirect_uri = 'http://localhost:5173'
client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')
combined = client_id + ":" + client_secret
encoded = base64.b64encode(combined.encode("ascii")).decode("ascii")

def print(*message):
    output = ''
    for obj in message:
        output += str(obj)
    builtins.print(output)

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

@app.get('/download/track')
def download(req: Request):

    track_id = req.query_params.get('track_id')
    session = login_from_stored()

    if check_premium(session):
        quality = AudioQuality.VERY_HIGH
    else:
        quality = AudioQuality.HIGH

    filename = download_track(track_id, session, quality)
    res = {"message": "success"}

    def chunk_generator_from_stream(stream, chunk_size, start, size):
        bytes_read = 0
        stream.seek(start)
        while bytes_read < size:
            bytes_to_read = min(chunk_size, size - bytes_read)
            yield stream.read(bytes_to_read)
            bytes_read = bytes_read + bytes_to_read
        stream.close()
    
    asked = req.headers.get('Range')
    if asked is None:
        asked = 'bytes=0-'
    print('asked: ' + asked)
    stream = open(filename, 'rb')
    total_size = Path(filename).stat().st_size

    start_byte_requested = int(asked.split('=')[-1].strip('-'))
    print('asked converted: ', start_byte_requested)
    end_byte_planned = min(start_byte_requested + BYTES_PER_RESPONSE, total_size)
    
    status_code = 206
    if end_byte_planned == total_size:
        status_code = 200

    chunk_generator = chunk_generator_from_stream(
        stream,
        chunk_size=BYTES_PER_RESPONSE,
        start=start_byte_requested,
        size=total_size
    )

    print(f'bytes {start_byte_requested}-{end_byte_planned}/{total_size}')
    headers = {
        'Accept-Ranges': 'bytes',
        'Content-Range': f'bytes {start_byte_requested}-{end_byte_planned}/{total_size}',
        'Content-Type': 'audio/mp3'
    }

    return StreamingResponse(chunk_generator, headers=headers, status_code=status_code)
    
