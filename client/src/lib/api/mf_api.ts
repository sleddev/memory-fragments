import { MfUsersAPI } from "./users/users";
import { MfAuthAPI } from "./users/auth";
import { serverUrl } from "../../config";

interface MFResponse {
  status: number;
  body: Record<string, any>;
}
interface MFRequest {
  endpoint: string;
  method?: string;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  body?: Object;
  useAuthHeader?: boolean;
}

export class MfAPI {
  auth: MfAuthAPI
  users: MfUsersAPI
  apiKey: () => string
  clientKey: () => string
  
  constructor() {
    this.auth = new MfAuthAPI(this);
    this.users = new MfUsersAPI(this);
    this.apiKey = () => this.auth.accessToken()
    this.clientKey = () => this.auth.derivedKey()
  }
  
  public _fetch(
    endpoint: string, method = "GET", query: Record<string, string> | undefined = undefined, headers: Record<string, string> = {}, body: Object | undefined = undefined,
    useAuthHeader = true
  ) {
    return fetch(serverUrl + endpoint + (query ? '?' + new URLSearchParams(query).toString() : ''), {
      method: method,
      headers: {
        ...headers,
        ...(useAuthHeader ? {Authorization: `Bearer ${this.apiKey()}`} : {}),
        ...(body ? {'Content-Type': 'application/json'} : {})
      },
      body: body ? JSON.stringify(body) : undefined
    })
  }
  public async makeRequest(params: MFRequest): Promise<MFResponse> {
    let res = await this._fetch(params.endpoint, params.method ?? "GET", params.query, params.headers, params.body, params.useAuthHeader ?? true)
    return {
      status: res.status,
      body: await res.json()
    }
  }
}