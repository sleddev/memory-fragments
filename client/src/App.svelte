<script lang="ts">
  import Login from './lib/Login.svelte'
  import Dashboard from './lib/Dashboard.svelte'
  import { onMount } from 'svelte'
import { to_number } from 'svelte/internal';

  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  const accessToken = localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('refresh_token')
  const expiresAt = localStorage.getItem('expires_at') !== null ? to_number(localStorage.getItem('expires_at')) : null
  const expiresAtRaw = localStorage.getItem('expires_at')

  onMount(function() {
    //console.log("onMount called")
  })

  function shouldRefresh(): boolean {
    return (
      expiresAtRaw === null || accessToken === null || refreshToken === null
    )
  }
  function shouldLogin(): boolean {
    return (
      refreshToken === null || refreshToken === undefined
    )
  }

</script>

{#if code}
<Login {code} />
{:else if !shouldLogin() }
<Dashboard {accessToken} {refreshToken} {expiresAtRaw} />
{:else}
<Login />
{/if}
