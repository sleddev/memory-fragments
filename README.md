# Hi there!
This is just a hobby project. My first idea was an app, that backs up your Spotify library. I have no clear vision of what I want this project to become. It's just me learning and having fun.

I plan to make a notetaking/diary part, kinda like Google Keep, tho not sure yet. Only time will tell


# Installation
I'm working on this for myself, to learn, and it is absolutely in developement stage. So the current version is not guaranteed to work (and if it does, don't expect much lol)

Requirements:
1. nodejs/npm installed
2. python installed
### Server

(optional) if you want to use virtualenv: from the repository's root directory run `python -m venv server`, then [activate the virtual environment](https://docs.python.org/3/tutorial/venv.html#creating-virtual-environments)

from the `server` directory, run `pip install -r requirements.txt`

Then run `python -m uvicorn server:app` to start the backend server

### Client

from the `client` directory, run `npm install`, then `npm run dev`. (you can also use `pnpm` or `yarn`)

Open `http://localhost:3000`, and you're good to go 👏
