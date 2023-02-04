import axios from "axios";

import retryAfterInterceptor from "./helpers/axios-retry-after";

const axiosInstance = axios.create({
  headers: {
    origin: "http://samgk.ru",
    referer: "http://samgk.ru/",
  },
});

axiosInstance.interceptors.response.use(undefined, retryAfterInterceptor(axiosInstance));

export default axiosInstance;
