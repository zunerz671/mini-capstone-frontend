import axios from 'axios'

const API_BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://v1mini-capstone-api.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
