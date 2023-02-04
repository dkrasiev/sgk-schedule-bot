import { AxiosError, AxiosInstance, AxiosPromise } from "axios";

import utils from "./axios-helpers";

interface RetryAfterOptions {
  isRetryable?: (error: AxiosError) => boolean;
  wait?: (error: AxiosError) => Promise<void>;
  retry?: (axios: AxiosInstance, error: AxiosError) => AxiosPromise;
}

export default function retryAfterInterceptor(
  axios: AxiosInstance,
  options: RetryAfterOptions = {}
) {
  const { isRetryable, wait, retry } = { ...utils, ...options };

  return async (error: AxiosError) => {
    if (isRetryable(error) === false) {
      throw error;
    }

    console.log("retry after");

    await wait(error);
    return retry(axios, error);
  };
}
