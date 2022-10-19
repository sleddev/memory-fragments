import { PlaylistApi } from "./apis/PlaylistApi";
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
  playlists: PlaylistApi
  user: UserApi
  
  constructor(accessToken: string) {
    this.accessToken = accessToken

    this.search = new SearchApi(this.accessToken)
    this.tracks = new TrackApi(this.accessToken)
    this.playlists = new PlaylistApi(this.accessToken)
    this.user = new UserApi(this.accessToken)
  }

  getAccessToken(): string {
    return this.accessToken
  }
}