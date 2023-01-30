import axios from "axios";

const instance = axios.create({
  headers: {
    origin: "http://samgk.ru",
    referer: "http://samgk.ru/",
  },
});

export default instance;
