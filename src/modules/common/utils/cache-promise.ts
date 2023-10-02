/**
 * Caches promise
 * @param {Promise<T>} promise Promise to cache
 * @returns {function(): Promise<T>}
 */
export function cachePromise<T>(promise: Promise<T>): () => Promise<T> {
  let data: T;

  return async (): Promise<T> =>
    data || promise.then((value) => (data = value));
}
