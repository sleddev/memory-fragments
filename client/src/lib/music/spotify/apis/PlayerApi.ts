import { makeRequest } from "../Requests"

export class PlayerApi {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async playTrack(id: string, device: string) {
    let formData = new URLSearchParams()
    formData.append('uris', '["spotify:track:' + id + '"]')
    let response = await makeRequest({
      url: 'https://api.spotify.com/v1/me/player/play',
      method: 'PUT',
      headers: 
      {
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json'
      },
      params: new Map([['market', 'HU'], ['device_id', device]]),
      data: JSON.parse('{"uris": ["spotify:track:' + id + '"]}')
    }).then((val) => console.log(val))
  }
}