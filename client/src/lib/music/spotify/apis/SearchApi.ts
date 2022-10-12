import { Track, type ITrackSerialized } from "../data/Track"
import { makeRequest } from "../Requests"
import { SpotifyApi } from "../SpotifyApi"

interface ISearchTracks {
  href: string
  items: ITrackSerialized[]
  limit: number
  next: string
  offset: number
  previous: string
  total: number
}

export class SearchApi {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async searchTracks(query: string, limit: number): Promise<Track[]> {
    let response = await makeRequest({
      url: 'https://api.spotify.com/v1/search/?market=HU&type=track&q=' + query + '&limit=' + limit,
      method: 'GET',
      headers: 
      {
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json'
      },
    })
    let search: ISearchTracks = response.tracks
    let tracks: Track[] = new Array<Track>()
    search.items.forEach((item) => {
      let track = new Track().fromJSON(item)
      tracks.push(track)
    })
    return tracks
  }
}