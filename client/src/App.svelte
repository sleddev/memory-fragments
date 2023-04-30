<script lang="ts">
  import  {Router, Route} from "svelte-routing";
  import Auth from "./auth/Auth.svelte";

  console.log(location.href)
</script>

<Router>
  <Route path="/auth/*"><Auth /></Route>
</Router>
soon<sup>TM</sup>
