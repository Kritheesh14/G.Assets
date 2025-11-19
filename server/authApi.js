import axiosClient from './axiosClient';

export const signupApi = (data) => axiosClient.post('/auth/signup', data);
export const loginApi  = (data) => axiosClient.post('/auth/login', data);
