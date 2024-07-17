import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://sappage.onrender.com',
});

export default axiosInstance;