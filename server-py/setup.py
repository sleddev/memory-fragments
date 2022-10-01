import subprocess

def main():
  print('### Dependencies ###\n')

#  print('Installing click...')
#  r = subprocess.run(['pip','install','click'], stdout=subprocess.DEVNULL)
#  if r.returncode == 0:
#    print('click successfully installed')
#    print('----------')
#  import click

  print('Installing dependencies...')
  r = subprocess.run(['pip','install','-r','requirements.txt'], stdout=subprocess.DEVNULL)
  if r.returncode == 0:
    print('Dependencies successfully installed')
    print('----------\n')

  print('### Spotify Web API credentials ###\n')
  client_id = input('Enter your client ID: ')
  client_secret = input('Enter your client secret: ')

  print('\nCreating .env file...')
  with open('.env', 'w') as env_file:
    env_file.write(f'CLIENT_ID={client_id}\n')
    env_file.write(f'CLIENT_SECRET={client_secret}')
    env_file.close()
  print('.env file successfully created')
  print('----------\n')

  print('### Installation complete! ###\n')
  print('run "uvicorn server:app" to start the backend server.\n')
  print('You will have to log in once to download .mp3 files.')
  print('To do that, run "python spotifydl.py"')

if __name__ == '__main__':
  main()