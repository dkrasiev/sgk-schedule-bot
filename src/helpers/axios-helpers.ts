import { AxiosError, AxiosInstance } from "axios";

const isRetryable = (error: AxiosError): boolean =>
  error.response?.status === 429;

const wait = (error: AxiosError): Promise<void> =>
  new Promise((resolve) =>
    setTimeout(resolve, Number(error.response?.headers["retry-after"]) || 30000)
  );

const retry = (axios: AxiosInstance, error: AxiosError) => {
  if (!error.config) {
    throw error;
  }

  console.log("retry");

  return axios(error.config);
};

export default {
  isRetryable,
  wait,
  retry,
};
