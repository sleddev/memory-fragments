<script lang="ts">
  import { to_number } from "svelte/internal";
  import { onMount } from 'svelte'
  import TestResult from "./TestResult.svelte";
  import UniversalPlayer from "./UniversalPlayer.svelte";
  import TrackCard from "./TrackCard.svelte";
  import type { Track } from "./spotify/data/Track";
    import { SpotifyApi } from "./spotify/SpotifyApi";
    import { serverURL, uniTrackID } from "./stores";
    import Sidebar from "./Sidebar.svelte";

	export let accessToken: string
	export let refreshToken: string
	export let expiresAtRaw: string
  let expiresAt = to_number(expiresAtRaw)

  let results;
  let player: UniversalPlayer
  let testTrack: Track

  const baseURL = window.location.protocol + '//' + window.location.host + '/'

	function shouldRefresh(): boolean {
	  return (
      accessToken === null || accessToken === undefined ||
      Math.floor(Date.now() / 1000) >= (expiresAt === NaN || expiresAtRaw === undefined || expiresAtRaw === null ? 0 : expiresAt)
    )
  }

  if (shouldRefresh()) refresh();

  function refresh(): void {
    console.log("access token expired")
    fetch(serverURL + 'refresh?refresh_token=' + refreshToken, {
      method: 'POST',
    }).then(response => {
      if (response.status !== 200) {
        localStorage.clear()
        window.location.href = baseURL
      }
      response.json().then(json => {
        console.log("got json: ", json)
        localStorage.setItem('access_token', json.access_token)
        if (json.refresh_token !== undefined) localStorage.setItem('refresh_token', json.refresh_token)
        localStorage.setItem('expires_at', json.expires_in + Math.floor(Date.now() / 1000))
        window.location.href = baseURL
      });
    })
  }

  onMount(function () {
    uniTrackID.update(() => '2gGdO0zLa9W8ce1Ig0BzFK')
  })
  
	
</script>
<div id="dashboard">
  <nav>
    <Sidebar />
  </nav>
  <main>
    <TestResult accessToken={accessToken} />
    <UniversalPlayer bind:this={player} {accessToken} />
  </main>
</div>

<style>
  #dashboard {
    display: flex;
    flex-direction: column;
    padding: 0;
  }
  nav {
    margin: 0;
    padding: 0;
    position: fixed;
    left: 0;
    top: 0;
    background-color: #1a1a1a;
    filter: drop-shadow(0 0 1em #222);
  }
</style>
