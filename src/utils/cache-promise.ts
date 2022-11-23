/**
 * Caches promise
 * @param {Promise<T>}
 * @returns {function(): Promise<T>}
 */
export function cachePromise<T>(promise: Promise<T>): () => Promise<T> {
  let data: T;

  return async (): Promise<T> => {
    if (data) return data;

    return promise.then((value) => (data = value));
  };
}
