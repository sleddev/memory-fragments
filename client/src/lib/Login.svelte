<script lang="ts">
  import { serverURL } from "./stores";


  export let code: string = ""
  export let refresh: boolean = false

  const baseURL = window.location.protocol + '//' + window.location.host + '/'

  const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=d028820e81fb4a6fb90ebf8b8bbbecbd&response_type=code&redirect_uri=" + baseURL + "&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-recently-played"

  if (code !== "") {
    console.log("got code: ", code)
    fetch(serverURL + 'login?code=' + code + '&redirect_uri=' + baseURL, {
      method: 'POST',
    }).then(response => {
      response.json().then(json => {
        console.log("got json: ", json)
        if (response.status !== 200) window.location.href = baseURL
        localStorage.setItem('access_token', json.access_token)
        localStorage.setItem('refresh_token', json.refresh_token)
        localStorage.setItem('expires_at', json.expires_in + Math.floor(Date.now() / 1000))
        window.location.href = baseURL
      });
    })
  }

  if (refresh) {
    console.log("access token needs to be refreshed")
  }
</script>

<button><a href={AUTH_URL}>Login with Spotify</a></button>
