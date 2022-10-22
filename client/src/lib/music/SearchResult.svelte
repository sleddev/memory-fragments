<script lang="ts">
  import { onMount } from "svelte";
  import { uniPaused, uniTrackID } from "./stores";
  import type { Track } from "./spotify/data/Track";
  import { SpotifyApi } from "./spotify/SpotifyApi";
  import TrackCard from './TrackCard.svelte'
  import type { IUserProfile } from "./spotify/apis/UserApi";
  
  export let accessToken: string

  let search: Track[]
  let profile: IUserProfile
  let query = 'wolf'
  let lastFetched: number
  let spotify = new SpotifyApi(accessToken)

  async function fetchResults() {
    if (!query) return;
    await spotify.search.searchTracks(query, 50).then((res) => search = Array.from(res))
    search = search
  }
  
  function logOut() {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("expires_in")
    window.location.reload()
  }
  
  onMount(async function() {
    let spotify = new SpotifyApi(accessToken)
    fetchResults()
    profile = await spotify.user.getProfile() as IUserProfile
  })

</script>

<div id="search-result">
  <div id="top-bar">
    <div id="search-wrapper">
      <svg id="search-icon" class="icon" fill='currentColor' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z"/></svg>
      <input type="text" placeholder='Search for a track...' bind:value={query} id="search-box" on:input="{() => fetchResults()}" on:paste="{() => fetchResults()}">
    </div>
    {#if profile}
    <div id="profile" on:click={() => logOut()} >
      <img id="profile-pic" src={profile.images[0].url} alt="" draggable="false">
      <div id="profile-name">{profile.display_name}</div>
    </div>
    {/if}
  </div>
  {#if search}
  <div id="tracks">
    <div id="top-row">
      <div id="top-index">#</div>
      <div id="top-name">NAME</div>
      <div id="top-album">ALBUM</div>
      <div id="top-etc">🕒</div>
    </div>
    {#each search as track, i}
      <div class="card">
        <TrackCard {accessToken} bind:track={track} i="{i + 1}" />
      </div>
    {/each}
  </div>
  {/if}
</div>

<style>
  #search-result {
    background-color: inherit;
    padding: 1.5em 2.5em;
    display: flex;
    flex-direction: column;
    gap: 2em;
  }
  #tracks {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding-bottom: 1em;
  }
  .card {
    margin: 0;
    padding: 0;
  }
  #top-bar {
    display: flex;
    height: 2rem;
  }
  #profile {
    display: flex;
    background-color: #050505;
    border-radius: 1rem;
    margin-left: auto;
    color: #fff;
    font-weight: 700;
    gap: 0.3rem;
    align-items: center;
    user-select: none;
    cursor: pointer;
  }
  #profile-pic {
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 0.25rem;
  }
  #profile-name {
    align-self: center;
    padding-right: 1rem;
  }
  #search-wrapper {
	  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    background-color: #eee;
    border-radius: 15px;
    color: #121212;
    display: flex;
    width: 15em;
    overflow: hidden;
    padding: 0.4rem;
    gap: 0.3rem;
    align-items: center;
  }
  #search-box {
    outline: none;
    border: none;
    background-color: inherit;
    width: 100%;
    height: 100%;
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #121212;
    caret-color: #121212;
  }
  #search-icon {
    width: 1.2em;
    height: 1.2em;
  }
  #top-row {
    display: flex;
    width: 100%;
    text-align: left;
    font-size: 0.9rem;
    color: #a0a0a0;
    border-bottom: 1px solid #282828;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    user-select: none;
  }
  #top-index {
    flex: 0 0 2.8rem;
    text-align: center;
  }
  #top-name {
    flex: 6 0 0;
    margin-left: 55px;
  }
  #top-album {
    flex: 4.2 0 0;
  }
  #top-etc {
    flex: 0 0 4rem;
    text-align: center;
  }

  @media (max-width: 720px) {
    #search-result {
      padding: 0 0 1em 0;
      gap: 0.5em;
    }
    #top-bar {
      margin: 1em auto;
    }
    #profile {
      display: none;
    }
  }
</style>