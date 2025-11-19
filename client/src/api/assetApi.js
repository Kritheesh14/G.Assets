// client/src/api/assetApi.js
import axiosClient from './axiosClient';

// search/list
export const fetchAssets = (params) =>
  axiosClient.get('/assets', { params });

// create with file upload (multipart/form-data)
export const createAssetApi = (formData) =>
  axiosClient.post('/assets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const fetchMyAssets = () =>
  axiosClient.get('/assets/mine');

export const fetchDashboardStats = () =>
  axiosClient.get('/assets/dashboard');

export const fetchHomeSummary = () =>
  axiosClient.get('/assets/home-summary');

// DELETE asset by id (uses same baseURL + auth as others)
export const deleteAsset = (id) =>
  axiosClient.delete(`/assets/${id}`);
