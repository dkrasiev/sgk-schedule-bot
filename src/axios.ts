import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    origin: "http://samgk.ru",
    referer: "http://samgk.ru/",
  },
});

export default axiosInstance;
