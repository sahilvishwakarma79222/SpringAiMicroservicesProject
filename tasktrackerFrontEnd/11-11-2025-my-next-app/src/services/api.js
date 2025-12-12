import axios from "axios";

const API = axios.create({
    baseURL: "http://192.168.0.112:8080/api/v1",
});

export default API;
