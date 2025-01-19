import axiosInstance from '../utils/axiosInstance';

export const createEmployeeUnitRole = (token: string, employeeData: object) => {
    return axiosInstance.post(`/master/unit-roles`, employeeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const getEmployeeUnitRoles = (token: string, pageNumber: number, pageSize: number, employeeId: string = '', unitId: string = '', roleId: string = '') => {
    return axiosInstance.get(`/master/unit-roles`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { employeeId, unitId, roleId, pageNumber, pageSize },
    });
  };
  
  export const getEmployeeUnitRoleById = (token: string, eurId: string) => {
    return axiosInstance.get(`/master/unit-roles/${eurId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const updateEmployeeUnitRole = (token: string, eurId: string, employeeData: object) => {
    return axiosInstance.put(`/master/unit-roles/${eurId}`, employeeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const deleteEmployeeUnitRole = (token: string, eurId: string) => {
    return axiosInstance.delete(`/master/unit-roles/${eurId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };