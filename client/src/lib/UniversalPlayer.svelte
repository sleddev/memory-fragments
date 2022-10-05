<script lang="ts">
  import type { Track } from "./spotify/data/Track";
  import { formatMilliseconds } from "./spotify/utils";

  export let accessToken: string
  export let track: Track = null
  export let paused = true
  let player: HTMLAudioElement
  let duration: number = 0
  let audioTime = 0

  const baseURL = window.location.protocol + '//' + window.location.host + '/'
  const serverURL = 'https://8000-sleepyhusko-spotifysvel-y8d10ocm1wu.ws-eu67.gitpod.io/'

  export function togglePlay() {
    paused = !paused
  }
  export function setTrack(toSet: Track, full: boolean) {
    if (full) {
      toSet.previewURL = serverURL + 'download/track?track_id=' + toSet.id
    }
    track = toSet
  }

</script>

{#if track}
<div id="uni-player">
  <audio bind:this={player} bind:paused src={track.previewURL} bind:currentTime={audioTime} bind:duration={duration} ></audio>
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
    background-color: #1a1a1a;
    width: 35em;
    position: sticky;
    bottom: 1em;
    margin: 1em auto;
    border: 1px solid #555;
    border-radius: 15px;
    filter: drop-shadow(0 0 1em #222);
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
  #details {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  
  #buttons-container {
    display: flex;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    min-width: 1em;
    min-height: 1em;
    margin-left: auto;
  }
  #play {
    transition: 0.2s;
    width: 1.2em;
    height: 1.2em;
    user-select: none;
    position: relative;
  }
  #playicon {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  #controls {
    display: flex;
    margin-top: auto;
    align-self: stretch;
    justify-content: space-between;
    gap: .5em;
    align-items: center;
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
    color: #777;
    font-size: 0.93em;
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
  
</style>