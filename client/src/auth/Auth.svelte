<script>
    import {Route, Router} from "svelte-routing";
    import Register from "./Register.svelte";
</script>

<div id="bg-container">
  <div id="svg"></div>
</div>
<div id="auth">
  <div id="panel">
    <h1 id="brand">
      <span class="brand">Memory</span><br/>Fragments
    </h1>
    <div class="sep"></div>
    <Router>
      <Route path="/register"><Register /></Route>
    </Router>
  </div>
</div>

<style lang="scss">
  $scale-factor: 0.75rem;
  
  $panel-bg: #FFFFFF05;
  $accent: #40aaff;
  
  #brand {
    font-size: 3.2 * $scale-factor;
    text-align: center;
    margin: 0;
    span.brand {
      color: $accent;
    }
  }
  
  #auth {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-size: cover;
  }
  #bg-container {
    width: 100%;
    height: 100%;
    position: fixed;
    box-shadow: black 0 0 5em inset;
  }
  #svg {
    width: 100%;
    height: 100%;
    background-color: #40AAFF8C;
    -webkit-mask-image: url("/assets/auth-bg.svg");
    mask-image: url("/assets/auth-bg.svg");
    -webkit-mask-size: cover;
    mask-size: cover;
  }
  
  #panel {
    background: $panel-bg;
    width: 30 * $scale-factor;
    padding: 2 * $scale-factor;
    border-radius: 3 * $scale-factor;
    backdrop-filter: blur(2 * $scale-factor);
  }
  
</style>