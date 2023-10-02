import axios from "axios";
import axiosThrottle from "axios-request-throttle";

axiosThrottle.use(axios, { requestsPerSecond: 1 });
export default axios;
