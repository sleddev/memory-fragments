<script lang="ts">
  import { to_number } from "svelte/internal";
  import { onMount } from 'svelte'
  import { serverURL, uniTrackID } from "./stores";
  import SearchResult from "./SearchResult.svelte";
  import UniversalPlayer from "./UniversalPlayer.svelte";
  import Sidebar from "./Sidebar.svelte";

	export let accessToken: string
	export let refreshToken: string
	export let expiresAtRaw: string
  let expiresAt = to_number(expiresAtRaw)

  let player: UniversalPlayer

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
  <div id="content">
    <nav>
      <Sidebar />
    </nav>
    <main>
      <SearchResult accessToken={accessToken} />
    </main>
  </div>
  <footer>
    <UniversalPlayer bind:this={player} {accessToken} />
  </footer>
</div>

<style>
  #dashboard {
    display: flex;
    flex-direction: column;
    padding: 0;
    max-height: 100vh;
    background-color: #121212;
  }
  #content {
    flex-grow: 0;
    flex-basis: 50%;
    overflow: hidden;
    display: flex;
  }
  nav {
    margin: 0;
    padding: 0;
    background-color: #000000;
    filter: drop-shadow(0 0 1em #070707);
  }
  main {
    overflow: auto;
    flex: 1;
  }
</style>
