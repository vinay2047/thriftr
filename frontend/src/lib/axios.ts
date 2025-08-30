import axios from "axios";

export const axiosInstance= axios.create({
    baseURL: import.meta.env.NODE_ENV==="production" ? "/api":"http://localhost:3000/api",
    withCredentials: true,
});