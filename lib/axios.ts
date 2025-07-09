import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API, // Usamos la variable del .env.local
});

export default api;
