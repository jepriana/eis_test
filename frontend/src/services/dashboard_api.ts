import axiosInstance from '../utils/axiosInstance';

export const getDashboardSummary = (token: string, startDate: string, endDate: string) => {
    return axiosInstance.get(`/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate },
    });
};