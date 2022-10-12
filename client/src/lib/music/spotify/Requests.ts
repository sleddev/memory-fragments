interface IRequestParameters {
  url: string,
  method: string,
  headers: HeadersInit,
  data?: BodyInit,
  params?: Map<string, string>
}

export function makeRequest({url, method, headers, data, params}: IRequestParameters) {
  if (params) {
    let pairs = []
    params.forEach((key, value) => pairs.push(value + '=' + key))
    url = url + '?' + pairs.join('&')
  }
  let body = JSON.stringify(data)
  let response = fetch(url, {
    headers: headers,
    body: body,
    method: method,
  }).then((res) => { return res.json() })
  return response as Promise<Response>
}