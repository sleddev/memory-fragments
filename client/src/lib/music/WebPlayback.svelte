<script lang="ts">
  import { onMount } from "svelte";
  import { SpotifyApi } from "./spotify/SpotifyApi";
  import { uniPaused } from "./stores";

  export let accessToken: string
  let player: Spotify.Player
  let spotify = new SpotifyApi(accessToken)
  let deviceID

  export function togglePlay() {
    console.log(player.getCurrentState().then((val) => {console.log(val)}))
    player.togglePlay()
  }
  export function play(id: string) {
    spotify.player.playTrack(id, deviceID)
  }
  export function seek(position: number) {
    player.seek(position)
  }
  

  onMount(function () {
    window.onSpotifyWebPlaybackSDKReady = () => {
      player = new window.Spotify.Player({
        name: 'Web Playback Player',
        getOAuthToken: cb => { cb(accessToken) },
        volume: 0.5,
      })

      player.addListener('ready', ({device_id}) => {
        console.log('Ready: ' + device_id)
        deviceID = device_id
      })

      player.addListener('not_ready', ({device_id}) => {
        console.log('Offline: ' + device_id)
      })
      player.addListener('player_state_changed', (val) => { uniPaused.update(() => val.paused) })

      player.connect()
    }
  })
</script>

{#if player}
{#await player.getVolume() then volume}
  <p on:click="{() => {togglePlay()}}">{volume}</p>
{/await}
{/if}