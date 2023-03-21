import { StorageAdapter } from "grammy";
import { createClient } from "redis";

type ReturnRedis = ReturnType<typeof createClient>;

export class RedisStorageAdapter<T> implements StorageAdapter<T> {
  /**
   * @constructor
   * @param {ReturnRedis} redis - Instance of redis.
   * @param {string} prefix - Prefix for each key. Default is "sessions"
   */
  constructor(
    private redis: ReturnRedis,
    private readonly prefix: string = "sessions"
  ) {
    if (!this.redis) {
      throw new Error("You should pass redis instance to constructor.");
    }
  }

  public async read(key: string): Promise<T | undefined> {
    const session = await this.get(key);
    if (session) {
      return JSON.parse(session) as unknown as T;
    }
  }

  public async write(key: string, value: T) {
    await this.set(key, JSON.stringify(value));
  }

  public async delete(key: string) {
    await this.del(key);
  }

  private async get(key: string) {
    return this.redis.get(this.getKeyWithPrefix(key));
  }

  private async set(key: string, value: string) {
    await this.redis.set(this.getKeyWithPrefix(key), value);
  }

  private async del(key: string) {
    await this.redis.del(this.getKeyWithPrefix(key));
  }

  private getKeyWithPrefix(key: string): string {
    return `${this.prefix}:${key}`;
  }
}
