import axiosClient from './axiosClient';

export const getProfileApi = () => axiosClient.get('/users/me');
export const updateProfileApi = (data) => axiosClient.put('/users/me', data);
