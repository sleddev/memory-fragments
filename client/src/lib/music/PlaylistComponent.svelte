<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import type { Playlist } from "./spotify/data/Playlist";
  import { Track } from "./spotify/data/Track";
  import { SpotifyApi } from "./spotify/SpotifyApi";
  import TrackCard from "./TrackCard.svelte";

  export let accessToken
  let playlist: Playlist
  let spotify = new SpotifyApi(accessToken)
  export let id = writable(window.location.pathname.split('/')[3])

  $: playlistUpdater = spotify.playlists.getPlaylist($id).then((res) => playlist = res)
</script>

{#if playlist}
<div id="playlist">
  <div id="header">
    <img src={playlist.images[0].url} alt="">
    <h2 id="name">{playlist.name}</h2>
  </div>
  <div id="top-row">
    <div id="top-index">#</div>
    <div id="top-name">NAME</div>
    <div id="top-album">ALBUM</div>
    <div id="top-etc">🕒</div>
  </div>
  <div id="tracks">
    {#each playlist.tracks as item, i}
      <TrackCard track={item} i={i + 1} {accessToken} />
    {/each}
  </div>
</div>
{/if}

<style>
  #playlist {
    background-color: inherit;
    padding: 1.5em 2.5em;
    display: flex;
    flex-direction: column;
    gap: 1em;
    color: #fff;
  }
  #header {
    display: flex;
    gap: 2em;
    align-items: flex-end;
    margin-bottom: 2em;
  }
  #name {
    font-size: 5rem;
    height: auto;
  }
  img {
    width: 200px;
    border-radius: 15px;
  }
  #top-row {
    display: flex;
    width: 100%;
    text-align: left;
    font-size: 0.9rem;
    color: #a0a0a0;
    border-bottom: 1px solid #282828;
    padding-bottom: 0.5rem;
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
</style>