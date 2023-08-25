from dotenv import set_key

print('##### Memory Fragments backend setup #####\n')
mongo_uri = input('MongoDB connection string: ')
db_suffix = input('Database name suffix: ')
server_url = input('Public URL for this server: ')
server_secret = input('Server secret, ideally hexadecimal: ')

gmail_addr = input('GMail address used for email verification: ')
gmail_pass = input('GMail password for said address: ')

spotify_id = input('Spotify client ID: ')
spotify_secret = input('Spotify client secret: ')

with open('.env', 'w') as f:
  pass
set_key('.env', 'MONGO_URI', mongo_uri)
set_key('.env', 'DB_SUFFIX', db_suffix)
set_key('.env', 'SERVER_URL', server_url)
set_key('.env', 'SERVER_SECRET', server_secret)
set_key('.env', 'GMAIL_ADDR', gmail_addr)
set_key('.env', 'GMAIL_PASS', gmail_pass)
set_key('.env', 'SPOTIFY_ID', spotify_id)
set_key('.env', 'SPOTIFY_SECRET', spotify_secret)