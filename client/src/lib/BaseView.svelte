<script lang="ts">
  import { links } from "svelte-navigator";


  const baseURL = window.location.protocol + '//' + window.location.host + '/'
</script>

<h1 id="brand"><span class="brand">Memory</span> <br> Fragments</h1>
<button use:links><a href='/music/'>Go to MF Music</a></button>

<style>
  #brand {
    user-select: none;
    color: #fff;
    outline: none;
  }
  .brand {
    color: #40aaff;
  }
  button {
    filter: drop-shadow(0 0 1em #0c0c0c);
    border: 1px solid #282828;
  }
  button:hover {
    border: 1px solid #40aaff;
  }
</style>