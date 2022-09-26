<script lang="ts">
    import { onMount } from "svelte";
  import type { Track } from "./spotify/data/Track";
    import { makeRequest } from "./spotify/Requests";
    import { SpotifyApi } from "./spotify/SpotifyApi";
  export let accessToken: string
  import TrackCard from './TrackCard.svelte'

  //let track: Track
  let search: Track[]
  let query = 'wolf'
  let lastFetched: number
  let spotify = new SpotifyApi(accessToken)
  let ready

  onMount(async function() {
    let spotify = new SpotifyApi(accessToken)
    //track = await spotify.tracks.getTrack('1301WleyT98MSxVHPZCA6M')
    fetchResults()
  })

  async function fetchResults() {
    if (!query) return;
    await spotify.search.searchTracks(query).then((res) => search = Array.from(res))
    search = search
    lastFetched = Date.now()
  }

</script>

<input type="text" placeholder='Search for a track:' bind:value={query} id="search-box" on:input="{() => fetchResults()}" on:paste="{() => fetchResults()}">
{#if search}
<div id="tracks">
  {#each search as track, i }
    <div class="card">
      <TrackCard {accessToken} bind:track={track} />
    </div>
    {#if i != search.length - 1}
    <div class="separator" />
    {/if}
  {/each}
</div>
{/if}

<style>
  #tracks {
    background-color: #1a1a1a;
    padding: 0;
    margin: 0 auto;
    border-radius: 15px;
    width: 30em;
    
  }
  .card {
    margin: 0;
    padding: 0;
  }
  .separator {
    height: 3px;
    background-color: #242424;
  }
  #search-box {
	font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    outline: none;
    background-color: #1a1a1a;
    padding: 0.7rem;
    font-size: 16px;
    border: none;
    border-radius: 15px;
    width: 15em;
    margin: 1em;
    color: #bbb;
    caret-color: #bbb;
    margin-top: 5em;
  }
</style>