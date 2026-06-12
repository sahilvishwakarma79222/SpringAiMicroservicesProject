import axios from "axios";

const API = axios.create({
    baseURL: "http://192.168.1.220:8081/api/v1",
});

export default API;
