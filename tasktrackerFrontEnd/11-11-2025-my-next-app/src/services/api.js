import axios from "axios";

const API = axios.create({
    baseURL: "http://192.168.1.220:8080/api/v1",
});

export default API;
