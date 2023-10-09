export interface IHTTPClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: Record<string, unknown>): Promise<T>;
}
