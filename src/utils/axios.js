import axios from "axios";

// Troque o IP abaixo pelo IP do seu WSL (descubra com 'hostname -I' no terminal WSL)
const api = axios.create({
    baseURL: 'http://localhost:8080/api'

});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
            if(token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
)

export default api;