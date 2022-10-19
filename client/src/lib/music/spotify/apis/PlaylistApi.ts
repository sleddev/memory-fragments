import { Playlist, type IPlaylistSerialized } from "../data/Playlist"
import { makeRequest } from "../Requests"

export class PlaylistApi {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async getPlaylist(id: string) {
    let response = await makeRequest({
      url: 'https://api.spotify.com/v1/playlists/' + id,
      method: 'GET',
      headers: 
      {
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json'
      },
      params: new Map([['market', 'HU']])
    })
    return new Playlist().fromJSON(response as unknown as IPlaylistSerialized)
  }
}