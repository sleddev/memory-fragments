<script lang="ts">
  import { Link } from 'svelte-navigator'
  import { onMount } from 'svelte';

  function updateLinks(event: MouseEvent) {
    let page = document.querySelector('#' + window.location.pathname.slice(1).split('/')[1] + '-item')
    page.classList.remove('active')
    let target = event.target as HTMLElement
    target.classList.add('active')
  }
  
  onMount(() => {
    document.querySelector('#home-item').classList.remove('active')
    let page = document.querySelector('#' + window.location.pathname.slice(1).split('/')[1] + '-item')
    page.classList.add('active')
  })

</script>

<div id="sidebar">
  <h1 id="brand"><span class="brand">MF</span> Music</h1>
  <div id="list">
    <Link to="home" ><div on:click={(e) => updateLinks(e)} id="home-item" class="list-item active"><svg id="home-icon" class="icon" fill='currentColor' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg> Home</div></Link>
    <Link to="search"><div on:click={(e) => updateLinks(e)} id="search-item" class="list-item"><svg id="search-icon" class="icon" fill='currentColor' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z"/></svg>Search</div></Link>
    <Link to="library"><div on:click={(e) => updateLinks(e)} id="library-item" class="list-item"><svg id="lib-icon" class="icon" fill='currentColor' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/></svg>Library</div></Link>
    <Link to="settings"><div on:click={(e) => updateLinks(e)} id="settings-item" class="list-item"><svg id="settings-icon" class="icon" fill='currentColor' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336c44.2 0 80-35.8 80-80s-35.8-80-80-80s-80 35.8-80 80s35.8 80 80 80z"/></svg>Settings</div></Link>
  </div>
</div>

<style>
  #sidebar {
    margin: 0;
    padding: 1em;
    height: 100%;
    border-right: 1px solid #282828;
    width: 14em;
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
    user-select: none;
    color: #fff;
    outline: none;
  }
  .brand {
    color: #40aaff;
  }
  #list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.9em;
  }
  .list-item {
    color: #a0a0a0;
    padding: 0.3rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.3em;
    user-select: none;
    cursor: pointer;
  }
  .list-item.active,
  .list-item:hover {
    background-color: rgba(150, 150, 150, 0.1);
    color: #fff;
    font-weight: bold;
  }
  .list-item:hover:not(.active) {
    font-weight: normal;
  }
  .icon {
    width: 1rem;
    height: 1rem;
    background-size: cover;
    color: inherit;;
    padding-left: 0.3rem;
  }

  @media (max-width: 720px) {
    #sidebar {
      display: none;
    }
  }

</style>