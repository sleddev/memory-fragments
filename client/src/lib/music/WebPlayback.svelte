<script lang="ts">
  import { onMount } from "svelte";

  export let accessToken: string
  let player: Spotify.Player

  function togglePlay() {
    player.togglePlay()
  }

  onMount(function() {
    window.onSpotifyWebPlaybackSDKReady = () => {
      player = new window.Spotify.Player({
        name: 'Web Playback Player',
        getOAuthToken: cb => { cb(accessToken) },
        volume: 0.5,
      })

      player.addListener('ready', ({device_id}) => {
        console.log('Ready: ' + device_id)
      })

      player.addListener('not_ready', ({device_id}) => {
        console.log('Offline: ' + device_id)
      })

      player.connect()
    }
  })

</script>

{#if player}
{#await player.getVolume() then volume}
  <p on:click="{() => {togglePlay()}}">{volume}</p>
{/await}
{/if}