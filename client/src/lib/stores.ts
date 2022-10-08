import { writable } from "svelte/store";

export const serverURL = 'https://8000-sleepyhusko-spotifysvel-y8d10ocm1wu.ws-eu70.gitpod.io/'

export const currentTime = writable(0)
export const seekingStore = writable(false)

export const uniTrackID = writable('')
export const uniPaused = writable(true)
export const uniAutoPlay = writable(false)
