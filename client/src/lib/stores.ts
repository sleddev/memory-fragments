import { writable } from "svelte/store";

export const serverURL = 'http://localhost:8000/'

export const currentTime = writable(0)
export const seekingStore = writable(false)

export const uniTrackID = writable('')
export const uniPaused = writable(true)
export const uniAutoPlay = writable(false)
