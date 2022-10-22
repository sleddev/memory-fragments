import { Playlist, type IPlaylistSerialized } from "../data/Playlist";
import { Track, type ITrackSerialized } from "../data/Track";
import { makeRequest } from "../Requests"
import type { IImage } from "../SpotifyApi";

export interface IUserProfile {
  country: string;
  display_name?: string;
  email: string;
  href: string;
  id: string;
  images: IImage[]
  product: "premium" | "free" | "open"
  type: "user"
  uri: string;
}
export interface IUserPlaylists {
  href: string;
  items: Playlist[];
  next: string;
  offset: number;
  previous: string;
  total: number;
}
interface ISavedTracks {
  href: string;
  items: ISavedTrack[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}
interface ISavedTrack {
  added_at: string;
  track: ITrackSerialized;
}

export class UserApi {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async getProfile() {
    let response = await makeRequest({
      url: 'https://api.spotify.com/v1/me/',
      method: 'GET',
      headers: 
      {
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) return (await response.json()) as IUserProfile
    return response
  }

  async getPlaylists() {
    let response = await makeRequest({
      url: 'https://api.spotify.com/v1/me/playlists/',
      method: 'GET',
      headers: 
      {
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) return (await response.json()) as IUserPlaylists
    return response
  }

  async getLikedSongs() {
    let response: ISavedTracks = await makeRequest({
      url: 'https://api.spotify.com/v1/me/tracks',
      method: 'GET',
      headers: 
      {
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json'
      },
      params: new Map([['market', 'HU'], ['limit', '50']])
    }) as unknown as ISavedTracks
    console.log(response)
    let tracklist: Track[] = []
    response.items.forEach((item) => {
      tracklist.push(new Track().fromJSON(item.track))
    })
    let next = response.next
    while (next != null) {
      let res = await makeRequest({
        url: next,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
          'Content-Type': 'application/json'
        }
      }) as unknown as ISavedTracks
      res.items.forEach((item) => {
        tracklist.push(new Track().fromJSON(item.track))
      })
      next = res.next
      
      console.log(res.next)
    }
    

    return new Playlist({
      playlist_name: 'Liked Songs',
      tracks: tracklist,
      total: response.total
    })
  }
}