<p align="center">
<img src="https://i.imgur.com/EjMNyZo.png" alt="">
</p>
<h1 align="center">!Outdated README!</h1>

# Hi there!
This is just a hobby project. My first idea was an app, that backs up your Spotify library. I have no clear vision of what I want this project to become. It is just me learning and having fun


# Installation
I'm working on this for myself only, and it is absolutely in developement stage. So current version is not guaranteed to work, and if it does, don't expect much

Requirements:
1. You will need to create an app at the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications).
2. FFmpeg installed on your system. (I'm planning to add do this with setup.py, but you have to install it manually for now)
3. npm installed on your system
### Server

(optional) if you want to use virtualenv: from the repository's root directory run `python -m venv server-py`, then [activate the virtual environment](https://docs.python.org/3/tutorial/venv.html#creating-virtual-environments)

from the `server-py` directory, run `python setup.py`, and complete the setup. (If you get errors, try running it as sudo)

Then run `python -m uvicorn server:app` to start the backend server

You also need to add `http://localhost:5173` to the Redirect URIs of your Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)

### Client

from the `client` directory, run `npm install`, then `npm run dev`.

Open `http://localhost:5173`, and you're good to go 👏
