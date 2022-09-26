import { formatMilliseconds } from "../utils"

export interface ITrackSerialized {
  album: ITrackAlbum;
  artists: Array<ITrackArtist>
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: Map<string, string>
  external_urls: Map<string, string>
  href: string
  id: string
  is_local: boolean
  is_playable: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}
interface ITrackAlbum {
  album_type: string
  artists: Array<ITrackArtist>
  external_urls: Map<string, string>
  href: string
  id: string
  images: Array<IImage>
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  uri: string
}
interface IImage {
  height: number
  url: string
  width: number
}
interface ITrackArtist {
  external_urls: Map<string, string>
  id: string
  name: string
  type: string
  uri: string
}

export class Track {
  album: ITrackAlbum
  artists: Array<ITrackArtist>
  discNumber: number
  durationMillis: number
  durationFormatted: string
  explicit: boolean
  href: string
  id: string
  isLocal: boolean
  isPlayable: boolean
  name: string
  popularity: number
  previewURL: string
  trackNumber: number
  type: string
  URI: string

  fromJSON(obj: ITrackSerialized) {
    this.discNumber = obj.disc_number
    this.durationMillis = obj.duration_ms
    this.durationFormatted = formatMilliseconds(obj.duration_ms)
    this.explicit = obj.explicit
    this.href = obj.href
    this.id = obj.id
    this.isLocal = obj.is_local
    this.isPlayable = obj.is_playable
    this.name = obj.name
    this.popularity = obj.popularity
    this.previewURL = obj.preview_url
    this.trackNumber = obj.track_number
    this.type = obj.type
    this.URI = obj.uri
    this.album = obj.album
    this.artists = obj.artists

    return this
  }
}