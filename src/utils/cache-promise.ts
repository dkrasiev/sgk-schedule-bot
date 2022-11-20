/**
 * Caches promise
 * @param {Promise<T>}
 * @returns {() => Promise<T>}
 */
export function cachePromise<T>(func: Promise<T>): () => Promise<T> {
  let data: T;

  return async (): Promise<T> => {
    if (data) return data;

    return func.then((value) => (data = value));
  };
}
