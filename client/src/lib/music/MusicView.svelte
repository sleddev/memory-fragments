<script lang="ts">
  import Login from './Login.svelte'
  import Dashboard from './Dashboard.svelte'
  import { onMount } from 'svelte'
  import { to_number } from 'svelte/internal';

  const urlParams = new URLSearchParams(window.location.search)
  const baseURL = window.location.protocol + '//' + window.location.host + '/'
  const code = urlParams.get('code')

  const accessToken = localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('refresh_token')
  const expiresAt = localStorage.getItem('expires_at') !== null ? to_number(localStorage.getItem('expires_at')) : null
  const expiresAtRaw = localStorage.getItem('expires_at')

  function shouldRefresh(): boolean {
    return (
      expiresAtRaw === null || accessToken === null || refreshToken === null ||
      expiresAtRaw === undefined || accessToken == undefined || refreshToken == undefined
    )
  }

  if (localStorage.getItem == undefined) {
    localStorage.clear()
    window.location.href = baseURL + 'music/'
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
