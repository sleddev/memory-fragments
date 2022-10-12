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
}