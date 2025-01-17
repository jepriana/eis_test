import axiosInstance from '../utils/axiosInstance';

export const register = (username: string, password: string, fullName: string, secretCode: string) => {
  return axiosInstance.post(`/auth/register`, { username, password, fullName, secretCode });
};

export const login = (username: string, password: string) => {
  return axiosInstance.post(`/auth/login`, { username, password });
};

export const refreshToken = (token: string) => {
  return axiosInstance.post(`/auth/refresh-token`, { refreshToken: token });
};

