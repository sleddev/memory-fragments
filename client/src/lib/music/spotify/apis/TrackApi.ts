import { Track } from "../data/Track"
import { makeRequest } from "../Requests"

export class TrackApi {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async getTrack(id: string) {
    let response = await makeRequest({
      url: 'https://api.spotify.com/v1/tracks/' + id,
      method: 'GET',
      headers: 
      {
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json'
      },
      params: new Map([['market', 'HU']])
    })
    return new Track().fromJSON(response)
  }
}