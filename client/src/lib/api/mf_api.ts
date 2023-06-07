import {MfUsersAPI} from "./users/users";
import {MfAuthAPI} from "./users/auth";
import {serverUrl} from "../../config";
import type {Writable} from "svelte/store";

interface MFResponse {
  status: number;
  body: Object;
}

export class MfAPI {
  auth: MfAuthAPI
  users: MfUsersAPI
  getApiKey: () => string
  
  constructor(apikey = "", apikeyGetter: () => string = null) {
    this.auth = new MfAuthAPI(this);
    this.users = new MfUsersAPI(this);
    this.getApiKey = function () {
      if (apikeyGetter) return apikeyGetter()
      return apikey
    }
  }
  
  public _fetch(
    endpoint: string, method = "GET", headers: Record<string, string> = {}, body: Object = undefined,
    useAuthHeader = true
  ) {
    return fetch(serverUrl + endpoint, {
      method: method,
      headers: useAuthHeader ? { ...headers, Authorization: `Bearer ${this.getApiKey()}`} : headers,
      body: body ? JSON.stringify(body) : undefined
    })
  }
  public async makeRequest(
    endpoint: string, method = "GET", headers: Record<string, string> = {}, body: Object = undefined,
    useAuthHeader = true
  ): Promise<MFResponse> {
    let res = await this._fetch(endpoint, method, headers, body, useAuthHeader)
    return {
      status: res.status,
      body: await res.json()
    }
  }
}