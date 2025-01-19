import axios from 'axios';
import { refreshToken } from '../services/auth_api';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const API_URL = process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:3001'; // Replace with your API URL


const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers: Function[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
};

const addRefreshSubscriber = (cb: Function) => {
  refreshSubscribers.push(cb);
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    const authContext = useContext(AuthContext);

    if (status === 401 && !config._retry) {
      if (!authContext || !authContext.refreshToken) {
        // If AuthContext is not available, just return the error
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data } = await refreshToken(authContext.refreshToken);
          authContext.setAccessToken(data.accessToken);
          authContext.setRefreshToken(data.refreshToken);
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          isRefreshing = false;
          onRefreshed(data.accessToken);
          refreshSubscribers = [];
        } catch (refreshError) {
          authContext.logoutUser();
          return Promise.reject(refreshError);
        }
      }

      const retryOriginalRequest = new Promise((resolve) => {
        addRefreshSubscriber((token: string) => {
          config.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(config));
        });
      });

      return retryOriginalRequest;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
