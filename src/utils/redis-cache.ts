import type { Redis } from "ioredis";
import { redis } from "../redis";

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

type RedisCacheOptions<Args extends unknown[] = unknown[]> = RequireAtLeastOne<
  {
    prefix: string;
    delimiter?: string;
    keyFn: (...args: Args) => string;
  },
  "prefix" | "keyFn"
>;

interface RedisCacheFactoryOptions {
  debug?: boolean;
  globalPrefix?: string;
  ttl?: number;
}

/**
 * Returns RedisCache decorator
 * @param redis Redis client
 * @param debug Enable log to console
 * @returns
 */
export function RedisCacheFactory(
  redis: Redis,
  { globalPrefix, debug, ttl }: RedisCacheFactoryOptions = { debug: false }
) {
  const defaultOptions: Partial<RedisCacheOptions> = {
    delimiter: ":",
  };

  return function RedisCache<This, Args extends unknown[], Return>(
    options?: RedisCacheOptions<Args>
  ) {
    const { prefix, delimiter, keyFn } = {
      ...defaultOptions,
      ...options,
    };

    function getKey(...args: Args) {
      if (keyFn) {
        return [globalPrefix, keyFn(...args)].filter(Boolean).join(delimiter);
      }

      return [globalPrefix, prefix, ...args].filter(Boolean).join(delimiter);
    }

    return function (
      target: (this: This, ...args: Args) => Promise<Return>,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      context: ClassMethodDecoratorContext<
        This,
        (this: This, ...args: Args) => Promise<Return>
      >
    ) {
      const methodName = String(context.name);
      function log(...args: unknown[]) {
        if (debug) {
          console.log(methodName, "REDIS CACHE:", ...args);
        }
      }

      return async function (this: This, ...args: Args): Promise<Return> {
        const key = getKey(...args);
        log("args:", args);
        log("key:", key);

        const redisData = await redis.call("JSON.GET", key, "$");
        if (typeof redisData === "string") {
          const cache = JSON.parse(redisData)[0] as Return;
          if (cache) {
            log("cache hit");
            return cache;
          }
        }

        log("cache miss");
        const result = await target.call(this, ...args);
        if (result) {
          log("caching");
          await redis.call("JSON.SET", key, "$", JSON.stringify(result));
          if (ttl) {
            await redis.expire(key, ttl);
          }
        }

        return result;
      };
    };
  };
}

export default RedisCacheFactory(redis, {
  debug: true,
  globalPrefix: "sgk-schedule-bot",
  ttl: 30 * 24 * 3600, // 1 month
});
