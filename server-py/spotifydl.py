import os
import json
import shutil
from getpass import getpass

import music_tag
import requests
from librespot.core import Session
from librespot.audio.decoders import AudioQuality
from librespot.audio.decoders import VorbisOnlyAudioQuality
from librespot.metadata import TrackId
from librespot.proto.Authentication_pb2 import AuthenticationType
from tqdm import tqdm
from pydub import AudioSegment

sanitize = ["\\", "/", ":", "*", "?", "'", "<", ">", '"']
SESSION: Session = None
ROOT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)) + '/music/')
CREDENTIALS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "credentials.json")
CHUNK_SIZE = 50000
REINTENT_DOWNLOAD = 30

#def login():
#  global SESSION
#  SESSION = Session.Builder().user_pass(input('Username / Email: '), input('Password: ')).create()

def login_from_stored():
  global SESSION

  if os.path.isfile("credentials.json"):
    try:
      SESSION = Session.Builder().stored_file().create()
      return SESSION
    except RuntimeError:
      pass
  while True:
    user_name = input("Username: ")
    password = getpass()
    try:
      SESSION = Session.Builder().user_pass(user_name, password).create()
      return SESSION
    except RuntimeError:
      pass


def login_token():
  global SESSION

def client():
  global QUALITY, SESSION
  print("--------  SpotifyDL  ---------\n")

  if check_premium(SESSION):
    print("[ DETECTED PREMIUM ACCOUNT - USING VERY_HIGH QUALITY ]\n\n")
    QUALITY = AudioQuality.VERY_HIGH
  else:
    print("[ DETECTED FREE ACCOUNT - USING HIGH QUALITY ]\n\n")
    QUALITY = AudioQuality.HIGH

  track_id = input('Track ID: ')
  download_track(track_id, SESSION, QUALITY)

def check_premium(session: Session):
  return session.get_user_attribute('type') == 'premium'

def download_track(track_id_str: str, session: Session, quality: AudioQuality):
  global ROOT_PATH, REINTENT_DOWNLOAD
  artists, album_name, name, image_url, release_year, disc_number, track_number, scraped_song_id, is_playable = get_song_info(track_id_str, session)

  _artist = artists[0]
  song_name = f'{_artist} - {name} ({album_name}).mp3'
  filename = os.path.join(ROOT_PATH, song_name)

  if not is_playable:
    print("###   SKIPPING:", song_name, "(SONG IS UNAVAILABLE)   ###")
  if os.path.isfile(filename) and os.path.getsize(filename):
    return filename
  else:
    if track_id_str != scraped_song_id:
      track_id_str = scraped_song_id

    track_id = TrackId.from_base62(track_id_str)
    stream = session.content_feeder().load(track_id, VorbisOnlyAudioQuality(quality), False, None)

    os.makedirs(ROOT_PATH, exist_ok=True)

    total_size = stream.input_stream.size
    downloaded = 0
    _CHUNK_SIZE = CHUNK_SIZE
    fail = 0
    with open(filename, 'wb') as file, tqdm(
          desc=song_name,
          total=total_size,
          unit='B',
          unit_scale=True,
          unit_divisor=1024,
          disable=False
    ) as bar:
      while downloaded <= total_size:
        data = stream.input_stream.stream().read(_CHUNK_SIZE)

        downloaded += len(data)
        bar.update(file.write(data))
        if (total_size - downloaded) < _CHUNK_SIZE:
          _CHUNK_SIZE = total_size - downloaded
        if len(data) == 0:
          fail += 1
        if fail > REINTENT_DOWNLOAD:
          break
    
    convert_audio_format(filename, quality)
    set_audio_tags(filename, artists, name, album_name, release_year, disc_number, track_number, track_id_str)
    set_music_thumbnail(filename, image_url)
    return filename

def get_song_info(song_id, session: Session):
  token = session.tokens().get('user-read-email')

  info = json.loads(requests.get('https://api.spotify.com/v1/tracks?ids=' + song_id + '&market=from_token', headers={'Authorization': 'Bearer ' + token}).text)

  artists = []
  for data in info['tracks'][0]['artists']:
    artists.append(sanitize_data(data['name']))
  album_name = sanitize_data(info['tracks'][0]['album']['name'])
  name = sanitize_data(info['tracks'][0]['name'])
  image_url = info['tracks'][0]['album']['images'][0]['url']
  release_year = info['tracks'][0]['album']['release_date'].split('-')[0]
  disc_number = info['tracks'][0]['disc_number']
  track_number = info['tracks'][0]['track_number']
  scraped_song_id = info['tracks'][0]['id']
  is_playable = info['tracks'][0]['is_playable']

  return artists, album_name, name, image_url, release_year, disc_number, track_number, scraped_song_id, is_playable

def convert_audio_format(filename, quality: AudioQuality):
  raw_audio = AudioSegment.from_file(filename, format='ogg', frame_rate=44100, channels=2, sample_width=2)
  
  if quality == AudioQuality.VERY_HIGH:
    bitrate = '320k'
  else:
    bitrate = '160k'
  raw_audio.export(filename, format='mp3', bitrate=bitrate)

def sanitize_data(value):
  global sanitize
  for i in sanitize:
    value = value.replace(i, "")
  return value.replace("|", "-")

def set_audio_tags(filename, artists, name, album_name, release_year, disc_number, track_number, track_id_str):
  tags = music_tag.load_file(filename)
  tags['artist'] = conv_artist_format(artists)
  tags['albumartist'] = conv_artist_format(artists)
  tags['tracktitle'] = name
  tags['album'] = album_name
  tags['year'] = release_year
  tags['discnumber'] = disc_number
  tags['tracknumber'] = track_number
  tags['comment'] = 'id[spotify.com:track:' + track_id_str + ']'
  tags.save()

def conv_artist_format(artists):
    formatted = ""
    for artist in artists:
        formatted += artist + ", "
    return formatted[:-2]

def set_music_thumbnail(filename, image_url):
    img = requests.get(image_url).content
    tags = music_tag.load_file(filename)
    tags['artwork'] = img
    tags.save()

def main():
  login_from_stored()
  client()

if __name__ == "__main__":
  main()