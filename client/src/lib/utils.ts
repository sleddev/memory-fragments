import {writable} from "svelte/store";

export function storableString(key: string, data: string) {
  let item = localStorage.getItem(key)
  let store = writable(item ?? data)
  store.subscribe(value => localStorage.setItem(key, value))
  return store
}
export function storableObject(key: string, data: Object) {
  let item = localStorage.getItem(key)
  let store = writable(item == null ? data : JSON.parse(item))
  store.subscribe(value => localStorage.setItem(key, JSON.stringify(value)))
  return store
}