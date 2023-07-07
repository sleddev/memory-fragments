import { DEV, batch, createEffect, createSignal, on } from "solid-js";
import { MfAPI } from "../lib/api/mf_api";

export function useAuth(mf: MfAPI) {
  const [accessToken, setAccessToken] = createSignal('')
  const [refreshToken, setRefreshToken] = createSignal('')
  const [expiresIn, setExpiresIn] = createSignal(0)
  const [expiresAt, setExpiresAt] = createSignal(0)
  const [derivedKey, setDerivedKey] = createSignal('')

  // Get auth data from localStorage
  const local = localStorage.getItem('auth')
  if (local) {
    let data = JSON.parse(local)
    batch(() => {
      setAccessToken(data['accessToken'])
      setRefreshToken(data['refreshToken'])
      setExpiresAt(data['expiresAt'])
      setExpiresIn(data['expiresAt'] - Date.now())
      setDerivedKey(data['derivedKey'])
    })
  }

  // Save auth data to localStorage
  createEffect(on([accessToken, refreshToken, expiresAt], () => {
    DEV && console.log({
      accessToken: accessToken(),
      refreshToken: refreshToken(),
      expiresIn: expiresIn(),
      expiresAt: expiresAt(),
      derivedKey: derivedKey()
    })
    localStorage.setItem('auth', JSON.stringify({
      accessToken: accessToken(),
      refreshToken: refreshToken(),
      expiresAt: expiresAt(),
      derivedKey: derivedKey() //TODO: PIN code stuff
    }))
  }, {defer: false}))

  // Handle refresh setTimouts
  createEffect(on(accessToken, () => {
    let timeout = setTimeout(() => {
      if (!refreshToken()) return;
      mf.auth.refresh(refreshToken())
    }, Math.max(0, expiresIn() - 30_000))
    return () => clearTimeout(timeout);
  }, {defer: false}))

  return {accessToken, setAccessToken, refreshToken, setRefreshToken, expiresIn, setExpiresIn, expiresAt, setExpiresAt, derivedKey, setDerivedKey}
}