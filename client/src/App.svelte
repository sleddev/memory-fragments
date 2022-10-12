<script>
  import BaseView from "./lib/BaseView.svelte";
  import MusicView from "./lib/music/MusicView.svelte";
  import { getSubdomain } from "./lib/music/spotify/utils";
</script>

{#if getSubdomain() === 'music'}
  <MusicView />
{:else}
  <BaseView />
{/if}