import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://d36mf6v2e37tzy.cloudfront.net",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {

    console.error("API Error Interceptor:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
