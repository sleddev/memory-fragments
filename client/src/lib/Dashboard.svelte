<script lang="ts">
  import { to_number } from "svelte/internal";
  import { onMount } from 'svelte'
  import TestResult from "./TestResult.svelte";
  import UniversalPlayer from "./UniversalPlayer.svelte";
  import TrackCard from "./TrackCard.svelte";
  import type { Track } from "./spotify/data/Track";
    import { SpotifyApi } from "./spotify/SpotifyApi";

	export let accessToken: string
	export let refreshToken: string
	export let expiresAtRaw: string
  let expiresAt = to_number(expiresAtRaw)

  let results;
  let player: UniversalPlayer
  let testTrack: Track

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

  onMount(async function () {
    let spotify = new SpotifyApi(accessToken)
    testTrack = await spotify.tracks.getTrack('2gGdO0zLa9W8ce1Ig0BzFK')
    player.setTrack(testTrack, true)
  })
  
	
</script>
<div id="dashboard">
  <nav>
    <h1>MF</h1>
  </nav>
  <main>
    <!-- <WebPlayback {accessToken} /> -->
    <TestResult accessToken={accessToken} />
    <UniversalPlayer bind:this={player} {accessToken} />
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
