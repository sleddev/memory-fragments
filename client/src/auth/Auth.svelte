<script>
    import {Route, Router} from "svelte-routing";
    import Register from "./Register.svelte";
    
    console.log("auth")
</script>

<Router>
  <Route path="/register"><Register /></Route>
</Router>