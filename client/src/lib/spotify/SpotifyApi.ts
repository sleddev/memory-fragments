import { SearchApi } from "./apis/SearchApi";
import { TrackApi } from "./apis/TrackApi";


export class SpotifyApi {
  private accessToken: string

  search: SearchApi
  tracks: TrackApi
  
  constructor(accessToken: string) {
    this.accessToken = accessToken

    this.search = new SearchApi(this.accessToken)
    this.tracks = new TrackApi(this.accessToken)
  }

  getAccessToken(): string {
    return this.accessToken
  }
}