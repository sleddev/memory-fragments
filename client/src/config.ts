export let serverUrl = "http://localhost:8000"
export let baseURL = window.location.protocol + '//' + window.location.host + '/'

export let spotifyRedirectURL = baseURL + 'music/'
let spotifyScopes = [
  'streaming', 'user-read-email', 'user-read-private', 'user-library-read',
  'user-library-modify', 'user-read-playback-state', 'user-modify-playback-state'
]
let spotifyClientID = ''
export let spotifyAuthURL = 
  `https://accounts.spotify.com/authorize?client_id=${spotifyClientID}&response_type=code&redirect_uri=${spotifyRedirectURL}&scope=${spotifyScopes.join('%20')}`