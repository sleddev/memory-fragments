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