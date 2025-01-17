import axiosInstance from '../utils/axiosInstance';

export const createRole = (token: string, roleData: object) => {
    return axiosInstance.post(`/master/roles`, roleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const getRoles = (token: string, keyword: string, pageNumber: number, pageSize: number) => {
    return axiosInstance.get(`/master/roles`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { keyword, pageNumber, pageSize },
    });
  };
  
  export const getRoleById = (token: string, roleId: string) => {
    return axiosInstance.get(`/master/roles/${roleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const updateRole = (token: string, roleId: string, roleData: object) => {
    return axiosInstance.put(`/master/roles/${roleId}`, roleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const deleteRole = (token: string, roleId: string) => {
    return axiosInstance.delete(`/master/roles/${roleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };