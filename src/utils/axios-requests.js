import axios from 'axios';

const requestHandler = (request) => {
  const token = localStorage.getItem('access_token');
  if (token) request.headers.Authorization = 'Bearer ' + token;

  return request;
};

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

instance.interceptors.request.use((request) => requestHandler(request));

export default instance;
