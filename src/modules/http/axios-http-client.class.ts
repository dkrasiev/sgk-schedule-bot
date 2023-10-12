import { AxiosInstance } from 'axios'

import { IHTTPClient } from './http-client.interface'

export class AxiosHTTPClient implements IHTTPClient {
  constructor(private axios: AxiosInstance) {}

  public async get(url: string) {
    return this.axios.get(url).then((r) => r.data)
  }

  public async post(url: string, data: Record<string, unknown>) {
    return this.axios.post(url, data).then((r) => r.data)
  }
}
