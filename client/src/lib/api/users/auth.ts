import { Accessor, Setter, batch } from "solid-js";
import { MfAPI } from "../mf_api";
import { useAuth } from "../../../hooks/useAuth";
import { bytesToB64, deriveKey, hexToBytes, sha256hash, sha512hash } from "../../crypto/hashing";

//TODO: Handle unknown errors

interface MFIsAvailableResponse {
  success: boolean;
  data?: {
    available: boolean;
    property: 'username' | 'email';
  }
  error?: 'body' | 'unknown';
}
interface MFSendEmailResponse {
  success: boolean;
  error?: 'body' | 'credentials' | 'already-verified' | 'wait' | 'send-failed' | 'unknown';
}
interface MFVerifyEmailResponse {
  success: boolean;
  error?: 'body' | 'attempts' | 'credentials' | 'unknown';
}
interface MFRegisterResponse {
  success: boolean;
  error?: 'body' | 'username' | 'email-taken' | 'invalid-email' | 'unknown';
}
interface MFLoginResponse {
  success: boolean;
  error?: 'body' | 'credentials' | 'verify' | 'unknown';
}
interface MFRefreshResponse {
  success: boolean;
  error?: 'body' | 'credentials' | 'unknown';
}

export class MfAuthAPI {
  mf: MfAPI;

  derivedKey: Accessor<string>;
  setDerivedKey: Setter<string>;

  accessToken: Accessor<string>;
  setAccessToken: Setter<string>;
  refreshToken: Accessor<string>;
  setRefreshToken: Setter<string>;
  expiresIn: Accessor<number>;
  setExpiresIn: Setter<number>;
  expiresAt: Accessor<number>;
  setExpiresAt: Setter<number>;

  constructor(mf: MfAPI) {
    this.mf = mf;
    
    const {
      accessToken, setAccessToken,
      refreshToken, setRefreshToken,
      expiresIn, setExpiresIn,
      expiresAt, setExpiresAt,
      derivedKey, setDerivedKey,
    } = useAuth(mf)
    this.accessToken = accessToken
    this.setAccessToken = setAccessToken
    this.refreshToken = refreshToken
    this.setRefreshToken = setRefreshToken
    this.expiresIn = expiresIn
    this.setExpiresIn = setExpiresIn
    this.expiresAt = expiresAt
    this.setExpiresAt = setExpiresAt
    this.derivedKey = derivedKey
    this.setDerivedKey = setDerivedKey
  }

  async isAvailable(username: string = '', email: string = ''): Promise<MFIsAvailableResponse> {
    if (username && email) return {
      success: false,
      error: 'body'
    }
    let res = await this.mf.makeRequest({
      endpoint: '/auth/isavailable',
      query: username ? {username: username} : {email: email},
      useAuthHeader: false,
    })
    if (res.status == 400) return {
      success: false,
      error: 'body'
    }
    return {
      success: true,
      data: {
        available: res.status !== 409,
        property: username ? 'username' : 'email'
      }
    }
  }

  async register(username: string = '', email: string = '', displayName: string = '', password = ''): Promise<MFRegisterResponse> {
    if (!(username && email && displayName && password)) return {
      success: false,
      error: 'body'
    }

    password = await sha512hash(password);

    let res = await this.mf.makeRequest({
      endpoint: '/auth/register',
      method: 'POST',
      body: {
        username: username,
        display_name: displayName,
        password: password,
        email: email
      },
      useAuthHeader: false,
    })
    if (res.status === 400) return {
      success: false,
      error: (res.body['error'] as string).includes('body') ? 'body' : 'invalid-email'
    }
    if (res.status === 409) {
      return {
        success: false,
        error: (res.body['error'] as string).includes('Username') ? 'username' : 'email-taken'
      }
    }
    if (res.status === 201) {
      return {
        success: true
      }
    }
    return {
      success: false,
      error: 'unknown'
    }
  }

  async login(username: string = '', email: string = '', password = ''): Promise<MFLoginResponse> {
    if (!(username || email) || !password) return {
      success: false,
      error: 'body'
    }

    password = await sha512hash(password);

    let res = await this.mf.makeRequest({
      endpoint: '/auth/login',
      method: 'POST',
      body: {
        ...(username ? {username: username} : {email: email}),
        password: password
      },
      useAuthHeader: false,
    })
    if (res.status === 400) return {
      success: false,
      error: 'body'
    }
    if (res.status === 401) {
      return {
        success: false,
        error: (res.body['error'] as string).includes('password') ? 'credentials' : 'verify'
      }
    }
    if (res.status === 200) {
      let data = {
        accessToken: res.body['access_token'],
        refreshToken: res.body['refresh_token'],
        createdAt: Number.parseInt(res.body['created_at']),
        expiresIn: Number.parseInt(res.body['expires_in'])
      }

      let sha = await sha256hash(password);
      let dk = await deriveKey(sha, username, "b64") as string;

      batch(() => {
        this.setExpiresAt(data.createdAt + data.expiresIn)
        this.setExpiresIn(data.expiresIn)
        this.setAccessToken(data.accessToken)
        this.setRefreshToken(data.refreshToken)
        this.setDerivedKey(dk);
      })

      return {
        success: true
      }
    }
    return {
      success: false,
      error: 'unknown'
    }
  }

  async refresh(token: string = ''): Promise<MFRefreshResponse> {
    if (!token) return {
      success: false,
      error: 'body'
    }

    let res = await this.mf.makeRequest({
      endpoint: '/auth/refresh',
      method: 'POST',
      body: {
        refresh_token: token
      },
      useAuthHeader: false,
    })
    if (res.status === 400) return {
      success: false,
      error: 'body'
    }
    if (res.status === 401) {
      return {
        success: false,
        error: 'credentials'
      }
    }
    if (res.status === 200) {
      let data = {
        accessToken: res.body['access_token'],
        createdAt: Number.parseInt(res.body['created_at']),
        expiresIn: Number.parseInt(res.body['expires_in'])
      }
      batch(() => {
        this.setExpiresAt(data.createdAt + data.expiresIn)
        this.setExpiresIn(data.expiresIn)
        this.setAccessToken(data.accessToken)
      })

      return {
        success: true
      }
    }
    return {
      success: false,
      error: 'unknown'
    }
  }

  logout() {
    localStorage.removeItem('auth')
    batch(() => {
      this.setDerivedKey('')
      this.setAccessToken('')
      this.setRefreshToken('')
      this.setExpiresIn(0)
      this.setExpiresAt(0)
    })
  }

  async sendEmail(username: string = '', email: string = ''): Promise<MFSendEmailResponse> {
    let errors: {[index: number]: MFSendEmailResponse['error']} = {
      400: 'body',
      401: 'credentials',
      409: 'already-verified',
      420: 'wait',
      500: 'send-failed'
    }

    if (!(username && email)) return {
      success: false,
      error: 'body'
    }

    let res = await this.mf.makeRequest({
      endpoint: '/auth/verify_email/send',
      method: 'POST',
      body: {
        username: username,
        email: email
      },
      useAuthHeader: false,
    })
    if (errors.hasOwnProperty(res.status)) {
      return {
        success: false,
        error: errors[res.status]
      }
    }
    if (res.status === 200) {
      return {
        success: true
      }
    }
    return {
      success: false,
      error: 'unknown'
    }
  }

  async verifyEmail(username: string = '', email: string = '', code: string = ''): Promise<MFVerifyEmailResponse> {
    let errors: {[index: number]: MFVerifyEmailResponse['error']} = {
      400: 'body',
      401: 'credentials',
      420: 'attempts'
    }

    if (!(username && code)) return {
      success: false,
      error: 'body'
    }

    let sha = await sha256hash(email + code)
    let b64code = bytesToB64(new Uint8Array(hexToBytes(sha)))

    let res = await this.mf.makeRequest({
      endpoint: '/auth/verify_email',
      method: 'POST',
      body: {
        username: username,
        code: b64code
      },
      useAuthHeader: false,
    })
    if (errors.hasOwnProperty(res.status)) {
      return {
        success: false,
        error: errors[res.status]
      }
    }
    if (res.status === 200) {
      return {
        success: true
      }
    }
    return {
      success: false,
      error: 'unknown'
    }
  }
}