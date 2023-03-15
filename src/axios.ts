import axios from "axios";

const myAxios = axios.create({
  headers: {
    origin: "http://samgk.ru",
    referer: "http://samgk.ru/",
  },
});

export default myAxios;
