import axiosInstance from '../utils/axiosInstance';

export const createEmployee = (token: string, employeeData: object) => {
    return axiosInstance.post(`/employees`, employeeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const getEmployees = (token: string, keyword: string, pageNumber: number, pageSize: number) => {
    return axiosInstance.get(`/employees`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { keyword, pageNumber, pageSize },
    });
  };
  
  export const getEmployeeById = (token: string, employeeId: string) => {
    return axiosInstance.get(`/employees/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const updateEmployee = (token: string, employeeId: string, employeeData: object) => {
    return axiosInstance.put(`/employees/${employeeId}`, employeeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const deleteEmployee = (token: string, employeeId: string) => {
    return axiosInstance.delete(`/employees/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };