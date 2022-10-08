<div id="sidebar">
  <h1 id="brand"><span class="brand">Memory</span> <br> Fragments</h1>
  <div id="list">
    <div class="list-item">Home</div>
    <div class="list-item active">Search</div>
    <div class="list-item">Library</div>
    <div class="list-item">Settings</div>
  </div>
</div>

<style>
  #sidebar {
    margin: 0;
    padding: 1em;
    height: 100%;
    border-right: 1px solid #555;
    width: 12em;
    text-align: left;
    height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  #brand {
    margin: 0;
    font-size: 24px;
  }
  .brand {
    color: #40aaff;
  }

  #list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 1em;
  }
  .list-item {
    color: #777;
    padding: 0.2rem;
    border-radius: 8px;
    padding-left: 1.5em;
  }
  .list-item.active,
  .list-item:hover {
    background-color: rgba(150, 150, 150, 0.1);
    color: #999;
    font-weight: bold;
  }
  .list-item:hover:not(.active) {
    font-weight: normal;
  }

</style>