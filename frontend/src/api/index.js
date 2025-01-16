import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Replace with your backend URL

const register = (data) => axios.post(`${API_URL}/auth/register`, data);
const login = (data) => axios.post(`${API_URL}/auth/login`, data);
const refreshToken = (data) => axios.post(`${API_URL}/auth/refresh-token`, data);

const getEmployees = (params, token) => axios.get(`${API_URL}/employees`, {
  headers: { Authorization: `Bearer ${token}` },
  params,
});

const getAllEmployees = (params, token) => axios.get(`${API_URL}/employees/all`, {
  headers: { Authorization: `Bearer ${token}` },
  params,
});

const getEmployeeById = (id, token) => axios.get(`${API_URL}/employees/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});

const createEmployee = (data, token) => axios.post(`${API_URL}/employees`, data, {
  headers: { Authorization: `Bearer ${token}` },
});

const updateEmployee = (id, data, token) => axios.put(`${API_URL}/employees/${id}`, data, {
  headers: { Authorization: `Bearer ${token}` },
});

const deleteEmployee = (id, token) => axios.delete(`${API_URL}/employees/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});

export {
  register,
  login,
  refreshToken,
  getEmployees,
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
