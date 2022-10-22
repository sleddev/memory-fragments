<script lang="ts">
  import { onMount } from "svelte";
  import { serverURL, uniAutoPlay, uniPaused, uniTrackID } from "./stores";
  import type { Track } from "./spotify/data/Track";
  import { SpotifyApi } from "./spotify/SpotifyApi";


  export let track: Track
  export let i: number
  export let accessToken: string
  let playButton: HTMLElement
  let player: HTMLAudioElement
  let paused = true
  let active = false
  let spotify = new SpotifyApi(accessToken)
  $: previewURL = track.previewURL ? track.previewURL : fixURL(track)
  $: activeHack = isActive(track)

  const baseURL = window.location.protocol + '//' + window.location.host + '/'

  function audioClick(){
    if (paused && !active) {
      uniPaused.update(() => true)
      uniTrackID.update(() => track.id)
    } else if (!paused && active) {
      uniPaused.update(() => true)
    } else if (paused && active) {
      uniPaused.update(() => false)
    }
  }

  function fixURL(track: Track) {
    spotify.tracks.getTrack(track.id).then((res) => {
      previewURL = res.previewURL;
    })
    return ''
  }
  function isActive(track: Track) {
    uniTrackID.update((value) => {
      active = value == track.id
      return value
    })

    if (!playButton) return;
    if (!active) {
      playButton.classList.remove("playing")
    } else {
      playButton.classList.add("playing")
    }
    uniPaused.update((value) => {
      if (active) paused = value
      else paused = true
      return value
    })
  }

  uniTrackID.subscribe((value) => {
    active = value == track.id
    isActive(track)
  })
  uniPaused.subscribe((value) => {
    paused = value
    isActive(track)
    if (!playButton) return;
    if (!active) return;
    if (value) {
      playButton.classList.remove("playing")
    } else {
      playButton.classList.add("playing")
    }
  })
</script>

<div class="track"> 
  <div id="i">{i}</div>
  <div id="image">
    <img src="{track.album.images[2].url}" alt="">
    <div id="play" bind:this={playButton} on:click|stopPropagation={() => audioClick()}>
      {#if paused}
      <svg id="playicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="#ddd" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
      </svg>
      {:else}
      <svg id="playicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="#ddd" d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>
      {/if}
    </div>
  </div>
  <div id="details">
    <div id="name-container">
      <div id="name">{track.name}</div>
      <div id="artist-container">
        {#if track.explicit}<div id="explicit">E</div>{/if}
        <div id="artist">{track.artists[0].name}</div>
      </div>
    </div>
    <div id="album">{track.album.name}</div>
  </div>
  <div id="end-container">
    <div id="duration">{track.durationFormatted}</div>
  </div>
</div>

<style>
  .track {
    color: #bbb;
    margin: 0;
    display: flex;
    gap: 1em;
    align-items: center;
    padding: 0.1em 0.8em;
    border-radius: 5px;
  }
  .track:hover {
    background-color: #ffffff1a;
  }
  #details {
    flex: 1 0 0;
    text-align: left;
    display: flex;
    align-items: center;
    overflow: hidden;
    gap: 1em;
  }
  #name-container {
    min-width: 0;
    flex: 1.4 1 0;
  }
  #name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    text-align: left;
    margin: 0;
    font-size: 1rem;
    color: #fff;
  }
  #artist-container {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    display: flex;
    min-width: 0;
  }
  #artist {
    text-align: left;
    color: #a0a0a0;
    margin: 0;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #album {
    flex: 1 1 0;
    color: #a0a0a0;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #i {
    display: flex;
    flex-basis: 1em;
    font-size: 0.9rem;
    color: #a0a0a0;
    user-select: none;
    direction: rtl;
  }
  img {
    width: 100%;
    border-radius: 3px;
  }
  #image {
    position: relative;
    width: 40px;
    height: 40px;
    user-select: none;
    flex-shrink: 0;
  }
  #play {
    background-color: rgba(0, 0, 0, 0.5);
    transition: 0.2s;
    width: 100%;
    height: 100%;
    position:absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    cursor: pointer;
    border-radius: 3px;
  }
  #play.playing {
    opacity: 1;
    transition: 0.2s;
  }
  #play:hover {
    opacity: 1;
    transition: 0.2s;
  }
  #play:not(.playing):not(:hover) {
    opacity: 0;
  }
  #playicon {
    color: white;
    width: 15px;
    align-self: center;
  }
  #explicit {
    display: block;
    text-align: center;
    background-color: #a0a0a0;
    border-radius: 3px;
    color: #1a1a1a;
    width: 1rem;
    height: 1rem;
    align-self: center;
    margin-right: 0.3rem;
    font-size: 0.6em;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    user-select: none;
    flex-shrink: 0;
  }
  #end-container {
    margin-left: auto;
  }
  #duration {
    color: #a0a0a0;
    font-size: 0.9rem;
    user-select: none;
  }

  @media (max-width: 720px) {
    #album {
      display: none;
    }
    #i {
      display: none;
    }
    #duration {
      display: none;
    }
  }
</style>