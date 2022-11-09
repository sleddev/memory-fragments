import { onDestroy } from "svelte";

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

export function formatMilliseconds(millis: number): string {
  let seconds = Math.round(millis / 1000)
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)

  seconds = seconds % 60
  minutes = minutes % 60

  return (hours !== 0 ? padTo2Digits(hours) + ':' : '') +
    padTo2Digits(minutes) + ':' + padTo2Digits(seconds) 
}

export function getSubdomain() {
  let parts = window.location.hostname.split('.')
  if (parts[0] === 'www') parts.splice(0, 1)
  let base = parts[parts.length - 1] === 'localhost' ? 1 : 2
  return parts.length > base ? parts[0] : ''
}

export function onInterval(callback: () => void, milliseconds: number) {
	const interval = setInterval(callback, milliseconds);
	onDestroy(() => {
		clearInterval(interval);
	});
}