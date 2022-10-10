<script lang="ts">
  import type { Track } from "./spotify/data/Track";
  import { SpotifyApi } from "./spotify/SpotifyApi";
  import { formatMilliseconds } from "./spotify/utils";
  import { serverURL, uniAutoPlay, uniPaused, uniTrackID } from "./stores";

  const baseURL = window.location.protocol + '//' + window.location.host + '/'
  
  export let accessToken: string
  export let track: Track = null
  export let paused = true
  let player: HTMLAudioElement
  let duration: number = 0
  let audioTime = 0
  let spotify = new SpotifyApi(accessToken)

  export function togglePlay() {
    uniPaused.update(() => !paused)
  }

  export function setTrack(toSet: Track, full: boolean) {
    if (full) {
      toSet.previewURL = serverURL + 'download/track?track_id=' + toSet.id
    }
    track = toSet
  }

  function onAudioLoad() {
    player.play().then(() => uniPaused.update(() => false)).catch((e) => {})
  }

  function audioEnded() {
    uniPaused.update(() => true)
  }
  
  uniTrackID.subscribe(async (value) => {
    if (value) setTrack(await spotify.tracks.getTrack(value), true)
  })
  uniPaused.subscribe((value) => {
    paused = value
  })

</script>

{#if track}
<div id="uni-player">
  <audio bind:this={player} bind:paused src={track.previewURL} bind:currentTime={audioTime} bind:duration={duration} on:loadedmetadata={() => onAudioLoad()} on:ended={() => {audioEnded()}} ></audio>
  <div id="album-photo">
    <img src="{track.album.images[2].url}" alt="">
  </div>
  <div id="details">
    <div id="name-container">
      {#if track.explicit}<div id="explicit">E</div>{/if}
      <div id="name">{track.name}</div>
      <div id="buttons-container">
        <div id="play" on:click|stopPropagation={() => togglePlay()}>
          {#if paused}
          <svg id="playicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
          </svg>
          {:else}
          <svg id="playicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>
          {/if}
        </div>
      </div>
    </div>
    <div id="artist">{track.artists[0].name}</div>
    {#if player}
    <div id="controls">
      <div id="current">{formatMilliseconds(audioTime * 1000)}</div>
      <div id="slider-container">
        <progress min="0" max={duration} value={audioTime} id="progress"></progress>
        <input type="range" min="0" max={duration} step="any" bind:value={audioTime} id="slider">
      </div>
      <div id="duration">{formatMilliseconds(duration * 1000)}</div>
    </div>
    {/if}
  </div>
</div>
{/if}

<style>
  #uni-player {
    background-color: #181818;
    flex-grow: 1;
    border-top: 1px solid #323232;
    filter: drop-shadow(0 0 1em #070707);
    display: flex;
    padding: 1em;
    gap: 1em;
    
  }
  #album-photo {
    display: block;
    height: 64px;
    width: 64px;
    border-radius: 15px;
    overflow: hidden;
    user-select: none;
    flex-shrink: 0;
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
    font-weight: 500;
    text-align: left;
    color: #fff;
  }
  #artist {
    text-align: left;
    color: #a0a0a0;
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
    user-select: none;
  }
  #details {
    display: flex;
    flex-direction: column;
    flex-basis: 30em;
  }
  #buttons-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 50%;
    translate: 50%;
    top: 1.2em;
    cursor: pointer;
    min-width: 2em;
    min-height: 2em;
    margin-left: auto;
    background-color: #eee;
    border-radius: 50%;
  }
  #play {
    transition: 0.2s;
    width: 1.2em;
    height: 1.2em;
    user-select: none;
    position: relative;
    color: #1a1a1a;
    translate: 8%;
  }
  #playicon {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  #controls {
    position: absolute;
    bottom: 0.5em;
    right: 50%;
    translate: 50%;
    width: 25em;
    display: flex;
    margin-top: auto;
    align-self: stretch;
    justify-content: space-between;
    gap: .5em;
    align-items: center;
    user-select: none;
  }
  #slider-container:hover ::-webkit-progress-value {
    background-color: #40aaff;
    transition: 0.2s;
  }
  #slider-container {
    flex: 1;
    position: relative;
    width: 100%;
    height: 100%;
    align-self: center;
    height: 0.5em;
  }
  #current,
  #duration {
    color: #a0a0a0;
    font-size: 0.9em;
  }
  #slider {
    -webkit-appearance: none;
    width: 100%;
    height: 0.5em;
    border-radius: 5px;
    background-color: transparent;
    position: absolute;
    left: 0;
    top: 0;
    translate: 0% -26.5%;
  }
  ::-webkit-progress-value {
    background-color: white;
    transition: 0.2s;
  }
  ::-webkit-progress-bar {
    background-color: #242424;
  }
  #progress {
    -webkit-appearance: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 97.5%;
    height: 0.3em;
    border-radius: 5px;
    overflow: hidden;
    background-color: #242424;
    translate: 1.8% 25%;
  }
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 0.8em;
    height: 0.8em;
    opacity: 0;
    background-color: white;
    border-radius: 50%;
    transition: 0.2s;
  }
  #slider:hover::-webkit-slider-thumb {
    opacity: 1;
    transition: 0.2s;
  }

  @media (max-width: 720px) {
    #uni-player {
      margin: 0 auto;
    }
    #controls {
      display: none;
    }
    #buttons-container {
      right: 1em;
      bottom: 1em;
      top: auto;
      translate: 0 0;
    }
  }
  
</style>