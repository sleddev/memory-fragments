<script>
  import { Router, Route } from "svelte-navigator";
  import BaseView from "./lib/BaseView.svelte";
  import MusicView from "./lib/music/MusicView.svelte";
  import { getSubdomain } from "./lib/music/spotify/utils";
  import ServiceWorker from "./ServiceWorker.svelte";
</script>

<ServiceWorker />
<Router>
  <Route path='music/*'><MusicView /></Route>
  <Route><BaseView /></Route>
</Router>