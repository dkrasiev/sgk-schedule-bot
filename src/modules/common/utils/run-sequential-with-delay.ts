import { wait } from "./wait";

export async function runSequentialWithDelay<T>(
  promises: (() => Promise<T>)[],
  delay: number,
): Promise<T[]> {
  const results: T[] = [];

  for (const promise of promises) {
    await wait(delay);
    results.push(await promise());
  }

  return results;
}
