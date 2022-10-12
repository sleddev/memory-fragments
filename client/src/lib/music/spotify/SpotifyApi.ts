import { SearchApi } from "./apis/SearchApi";
import { TrackApi } from "./apis/TrackApi";
import { UserApi } from "./apis/UserApi";

export interface IImage {
  height: number
  url: string
  width: number
}

export class SpotifyApi {
  private accessToken: string

  search: SearchApi
  tracks: TrackApi
  user: UserApi
  
  constructor(accessToken: string) {
    this.accessToken = accessToken

    this.search = new SearchApi(this.accessToken)
    this.tracks = new TrackApi(this.accessToken)
    this.user = new UserApi(this.accessToken)
  }

  getAccessToken(): string {
    return this.accessToken
  }
}