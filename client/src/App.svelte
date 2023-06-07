<script lang="ts">
  import Auth from "./auth/Auth.svelte";
  import {Router, Route} from "svelte-routing";
  import {deriveKey, sha256hash} from "./lib/crypto/hashing";
  
  async function init() {
    let sha = await sha256hash("asd");
    let dk = await deriveKey(sha, "husky", "b64");
    console.log(dk)
  }
  init()
</script>

<Router>
  <Route path="/auth/*"><Auth /></Route>
</Router>