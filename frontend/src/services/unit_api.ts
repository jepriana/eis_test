import axiosInstance from '../utils/axiosInstance';

export const createUnit = (token: string, unitData: object) => {
    return axiosInstance.post(`/master/units`, unitData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const getUnits = (token: string, keyword: string, pageNumber: number, pageSize: number) => {
    return axiosInstance.get(`/master/units`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { keyword, pageNumber, pageSize },
    });
  };
  
  export const getUnitById = (token: string, unitId: string) => {
    return axiosInstance.get(`/master/units/${unitId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const updateUnit = (token: string, unitId: string, unitData: object) => {
    return axiosInstance.put(`/master/units/${unitId}`, unitData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const deleteUnit = (token: string, unitId: string) => {
    return axiosInstance.delete(`/master/units/${unitId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };