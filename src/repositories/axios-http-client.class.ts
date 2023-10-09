import { AxiosInstance } from "axios";
import { inject, injectable } from "inversify";

import { TYPES } from "../config/types.const";
import { IHTTPClient } from "../modules/http/http-client.interface";

@injectable()
export class AxiosHTTPClient implements IHTTPClient {
  constructor(@inject(TYPES.Axios) private axios: AxiosInstance) {}

  public async get(url: string) {
    return this.axios.get(url).then((r) => r.data);
  }

  public async post(url: string, data: Record<string, unknown>) {
    return this.axios.post(url, data).then((r) => r.data);
  }
}
