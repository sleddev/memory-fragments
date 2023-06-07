import {MfAPI} from "./lib/api/mf_api";

export let mf = new MfAPI("", () => localStorage.getItem("access_token"))