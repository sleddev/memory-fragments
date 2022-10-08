<script lang="ts">
    import { onMount } from "svelte";
  import type { Track } from "./spotify/data/Track";
    import { SpotifyApi } from "./spotify/SpotifyApi";
    import { serverURL, uniAutoPlay, uniPaused, uniTrackID } from "./stores";


  export let track: Track
  let playButton: HTMLElement
  let player: HTMLAudioElement
  let paused = true
  let active = false
  let iconPath
  export let accessToken: string
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
  function audioEnded() {
    paused = player.ended;
    playButton.classList.remove("playing")
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

  onMount(() => {
  })

  uniTrackID.subscribe((value) => {
    active = value == track.id
  })
  uniPaused.subscribe((value) => {
    paused = value
    if (!active) return;
    if (!playButton) return;
    if (value) {
      playButton.classList.remove("playing")
    } else {
      playButton.classList.add("playing")
    }
  })

  
</script>

<div class="track" on:click={() => audioClick()}> 
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
  <div id="separator"></div>
  <div id="details">
    <div id="name-container">
      {#if track.explicit}<div id="explicit">E</div>{/if}
      <div id="name">{track.name}</div>
    </div>
    <div id="artist">{track.artists[0].name}</div>
    <div id="duration">{track.durationFormatted}</div>
  </div>
</div>

<style>
  .track {
    color: #bbb;
    background-color: #1a1a1a;
    border-radius: 15px;
    padding: 1em;
    margin: 0;
    display: flex;
    width: 28em;
    height: calc(64px);
  }
  img {
    border-radius: 15px;
    width: 64px;
  }
  #details {
    width: 80%;
    position: relative;
    text-align: left;
  }
  #name-container {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
    text-align: left;
    display: flex;
  }
  #name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
    text-align: left;
  }
  #duration {
    box-sizing: border-box;
    text-align: right;
    position: absolute;
    display: block;
    bottom: 0;
    right: 0;
    color: #777
  }
  #separator {
    margin: 0 0.5em;
    flex-shrink: 0;
  }
  #artist {
    text-align: left;
    color: #777;
  }
  #image {
    position: relative;
  }
  #play {
    background-color: rgba(0, 0, 0, 0.5);
    transition: 0.2s;
    display: block;
    width: 64px;
    height: 64px;
    border-radius: 15px;
    position:absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    cursor: pointer;
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
    width: 20px;
    align-self: center;
  }
  #explicit {
    display: block;
    text-align: center;
    background-color: #777;
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
  }
  #download {
    height: 1em;
    padding: 0.5em;
    align-self: center;
    background-color: #777;
    position: absolute;
    right: 0;
  }

</style>