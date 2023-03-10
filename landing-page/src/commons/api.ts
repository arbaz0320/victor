import axios from "axios";
import { parseCookies } from "nookies";

const { "nextauth.token": token } = parseCookies();

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST,
});

if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
