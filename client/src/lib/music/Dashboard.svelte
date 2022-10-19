<script lang="ts">
  import { to_number } from "svelte/internal";
  import { onMount } from 'svelte'
  import { serverURL, uniTrackID } from "./stores";
  import SearchResult from "./SearchResult.svelte";
  import UniversalPlayer from "./UniversalPlayer.svelte";
  import Sidebar from "./Sidebar.svelte";
  import { Router, Route } from "svelte-navigator";
  import NotFound from "../NotFound.svelte";
  import PlaylistComponent from "./PlaylistComponent.svelte";
    import { Playlist } from "./spotify/data/Playlist";
    import { writable } from "svelte/store";

	export let accessToken: string
	export let refreshToken: string
	export let expiresAtRaw: string
  let expiresAt = to_number(expiresAtRaw)

  let player: UniversalPlayer

  const baseURL = window.location.protocol + '//' + window.location.host + '/'
  if (window.location.pathname === '/music/') window.location.pathname = '/music/search/'

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
        window.location.href = baseURL + 'music/'
      }
      response.json().then(json => {
        console.log("got json: ", json)
        if (json.access_token != undefined) {
          localStorage.setItem('access_token', json.access_token)
        } else {
          localStorage.clear()
          window.location.href = baseURL + 'music/'
        }
        if (json.refresh_token != undefined) localStorage.setItem('refresh_token', json.refresh_token)
        localStorage.setItem('expires_at', json.expires_in + Math.floor(Date.now() / 1000))
        window.location.href = baseURL + 'music/'
      });
    })
  }

  onMount(function () {
    //uniTrackID.update(() => '2gGdO0zLa9W8ce1Ig0BzFK')
    
  })
  
	
</script>
<div id="dashboard">
  <div id="content">
    <Router primary={false}>
      <nav>
        <Sidebar {accessToken} />
      </nav>
      <main>
        <Route path="search/"><SearchResult accessToken={accessToken} /></Route>
        <Route path="playlist/:id" let:params><PlaylistComponent {accessToken} id={writable(params.id)} /></Route>
        <Route><NotFound /></Route>
      </main>
    </Router>
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
    height: 100%;
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
    position: relative;
  }

  @media (max-width: 720px) {
    footer {
      position: sticky;
      bottom: 0;
      left: 0;
    }

    #dashboard {
      display: block;
      height: 100vh;
    }
  }
</style>
