<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import type { IUserProfile } from "./spotify/apis/UserApi";
  import type { Playlist } from "./spotify/data/Playlist";
  import { Track } from "./spotify/data/Track";
  import { SpotifyApi } from "./spotify/SpotifyApi";
  import TrackCard from "./TrackCard.svelte";

  export let accessToken
  let playlist: Playlist
  let profile: IUserProfile
  let spotify = new SpotifyApi(accessToken)

  onMount(async () => {
  playlist = await spotify.user.getLikedSongs()
  profile = await spotify.user.getProfile() as IUserProfile
  })
</script>

<div id="header">
  <div id="icon"><svg id="heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg></div>
  <div id="type">PLAYLIST</div>
  <h1>Liked songs</h1>
  {#if playlist && profile}
  <div id="details">
    <div id="name-and-img">
      <img src={profile.images[0].url} alt="">
      <b>{profile.display_name}</b> • {playlist.total} {playlist.total === 1 ? 'song' : 'songs'}
    </div>
  </div>
  {/if}
</div>
<div id="liked-songs">
<div id="top-row">
  <div id="top-index">#</div>
  <div id="top-name">NAME</div>
  <div id="top-album">ALBUM</div>
  <div id="top-etc">🕒</div>
</div>
{#if playlist}
  <div id="tracks">
    {#each playlist.tracks as item, i}
      <TrackCard track={item} i={i + 1} {accessToken} />
    {/each}
  </div>
{/if}
</div>

<style>
  #liked-songs {
    background-color: inherit;
    padding: 1.5em 2.5em;
    display: flex;
    flex-direction: column;
    gap: 1em;
    color: #fff;
    background-size: 100% 16rem;
    background-repeat: no-repeat;
    background-image: linear-gradient(to bottom, rgba(94, 40, 219, 0.233), transparent);
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
  #header {
    background-image: linear-gradient(178deg, #2898f3e3, #481fa86e);
    padding: 2.5rem;
    display: GRID;
    grid-template:
      '💙 type'
      '💙 name'
      '💙 details';
    grid-template-rows: 40% 40% 20%;
    grid-template-columns: 15rem auto;
    text-align: left;
    color: #fff;
    column-gap: 1.5rem;
    user-select: none;
  }
  h1 {
    margin: 0;
    font-size: 5rem;
    grid-area: name;
    letter-spacing: -4px;
    z-index: 1;
  }
  #type {
    grid-area: type;
    display: flex;
    align-items: flex-end;
    font-weight: bold;
    font-size: 0.9rem;
    z-index: 1;
    letter-spacing: -0.6px;
  }
  #icon {
    width: 15rem;
    height: 15rem;
    grid-area: 💙;
    background-image: linear-gradient(125deg, #6e26e2, #3893dd, #11e7c4);
    border-radius: 15px;
    filter: drop-shadow(0 0 2em #35353556);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #heart {
    widows: 5rem;
    height: 5rem;
  }
  #details {
    display: flex;
    align-items: flex-end;
  }
  #details img {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
  }
  #name-and-img {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.9rem;
    z-index: 1;
  }
</style>
