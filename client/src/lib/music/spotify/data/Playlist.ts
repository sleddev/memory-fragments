import type { IImage } from "../SpotifyApi";
import { Track, type ITrackSerialized } from "./Track";

export interface IPlaylistSerialized {
  collaborative: boolean;
  description: string;
  followers: IFollowers;
  id: string;
  images: IImage[];
  name: string;
  owner: IPlaylistOwner;
  public: boolean;
  snapshot_id: string;
  tracks: IPlaylistTracks;
  type: string;
  uri: string;
}
interface IFollowers {
  href: string | null;
  total: number;
}
interface IPlaylistOwner {
  display_name: string;
}
interface IPlaylistTracks {
  href: string;
  items: IPlaylistTrack[];
  limit: number;
  next: string
  offset: number;
  previous: string;
  total: number;
}
interface IPlaylistTrack {
  added_at: string;
  is_local: boolean;
  track: ITrackSerialized;
}

export class Playlist {
  collaborative: boolean;
  description: string;
  followers: IFollowers;
  id: string;
  images: IImage[];
  name: string;
  owner: IPlaylistOwner;
  public: boolean;
  snapshotID: string;
  tracks: Track[]
  type: string;
  uri: string;
  total: number;

  constructor({
    collaborative = false,
    description = '',
    followers = <IFollowers>{},
    id = '',
    images = new Array<IImage>(),
    playlist_name = '',
    owner = <IPlaylistOwner>{},
    is_public = false,
    snapshot_id = '',
    type = 'playlist',
    uri = '',
    tracks = new Array<Track>(),
    total = 0
  } = {}) {
    this.collaborative = collaborative
    this.description = description
    this.followers = followers
    this.id = id
    this.images = images
    this.name = playlist_name
    this.owner = owner
    this.public = is_public 
    this.snapshotID = snapshot_id
    this.type = type
    this.uri = uri
    this.tracks = tracks
    this.total = total

    return this;
  }

  fromJSON(obj: IPlaylistSerialized) {
    this.collaborative = obj.collaborative
    this.description = obj.description
    this.followers = obj.followers
    this.id = obj.id
    this.images = obj.images
    this.name = obj.name
    this.owner = obj.owner
    this.public = obj.public
    this.snapshotID = obj.snapshot_id
    this.type = obj.type
    this.uri = obj.uri

    let tracklist = []
    obj.tracks.items.forEach((val) => {
      tracklist.push(new Track().fromJSON(val.track))
    })
    this.tracks = tracklist

    return this
  }
}