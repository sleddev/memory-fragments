<script lang="ts">
  import { to_number } from "svelte/internal";
  import { SpotifyWebApi } from "spotify-web-api-ts"
  import { onMount } from 'svelte'
  import type { Track } from "spotify-web-api-ts/types/types/SpotifyObjects";
  import TestResult from "./TestResult.svelte";
  import WebPlayback from "./WebPlayback.svelte";

	export let accessToken: string
	export let refreshToken: string
	export let expiresAtRaw: string
  let expiresAt = to_number(expiresAtRaw)

  let results;

	function shouldRefresh(): boolean {
	  return (
      accessToken === null || accessToken === undefined ||
      Math.floor(Date.now() / 1000) >= (expiresAt === NaN || expiresAtRaw === undefined || expiresAtRaw === null ? 0 : expiresAt)
    )
  }

  if (shouldRefresh()) refresh();

  function refresh(): void {
    console.log("access token expired")
    fetch('http://localhost:8000/refresh?refresh_token=' + refreshToken, {
      method: 'POST',
    }).then(response => {
      if (response.status !== 200) {
        localStorage.clear()
        window.location.href = "http://localhost:5173"
      }
      response.json().then(json => {
        console.log("got json: ", json)
        localStorage.setItem('access_token', json.access_token)
        if (json.refresh_token !== undefined) localStorage.setItem('refresh_token', json.refresh_token)
        localStorage.setItem('expires_at', json.expires_in + Math.floor(Date.now() / 1000))
        window.location.href = "http://localhost:5173"
      });
    })
  }

  onMount(function () {
    let spotify = new SpotifyWebApi({ accessToken: accessToken})
    results = spotify.search.searchTracks('wolf', { market: 'HU' }).then((response) => {
      let array = new Array<Track>
      response.items.forEach(track => { array.push(track) })
      return array
    })
  })
  
	
</script>
<div id="dashboard">
  <nav>
    <h1>MF</h1>
  </nav>
  <main>
    <!-- <WebPlayback {accessToken} /> -->
    <TestResult accessToken={accessToken} />
  </main>
</div>

<style>
  #dashboard {
    display: flex;
    flex-direction: column;
  }
  nav {
    width: 100%;
    /* background-color: #1a1a1a; */
    margin: 0;
    display: flex;
    height: 3rem;
    align-items: center;
  }
  h1 {
    margin: 0 0.5em;
    font-size: 24px;
  }
</style>
