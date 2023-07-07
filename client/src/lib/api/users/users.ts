import { MfAPI } from "../mf_api";

interface MFMeResponse {
  success: boolean;
  data?: {
    username: string;
    display_name: string;
    email: string;
    verified: boolean;
    preferences: MFMePreferences;
    images: MFMeImages;
    created_at: number;
    last_login: number;
  }
  error?: 'unauthorized' | 'unknown'
}
interface MFMePreferences {
}
interface MFMeImages {
  banner: string;
  profile_pic: string;
}

export class MfUsersAPI {
  mf: MfAPI;
  
  constructor(mf: MfAPI) {
    this.mf = mf;
  }

  async me(): Promise<MFMeResponse> {
    let res = await this.mf.makeRequest({endpoint: '/me'})
    if (res.status === 401) {
      return {success: false, error: 'unauthorized'}
    }
    if (res.status !== 200) {
      return {success: false, error: 'unknown'}
    }

    return {
      success: true,
      data: res.body as MFMeResponse['data']
    }
  }
}