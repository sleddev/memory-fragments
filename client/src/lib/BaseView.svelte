<script lang="ts">
  const baseURL = window.location.protocol + '//' + window.location.host + '/'
  let musicURL = window.location.protocol + '//' + 'music.' + window.location.host + '/'
</script>

<h1 id="brand"><span class="brand">Memory</span> <br> Fragments</h1>
<button><a href={musicURL}>Go to MF Music</a></button>

<style>
  #brand {
    user-select: none;
    color: #fff;
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