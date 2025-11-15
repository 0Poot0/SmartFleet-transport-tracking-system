import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getLiveLocation = async (vehicleId = null) => {
  try {
    const params = vehicleId ? { vehicle_id: vehicleId } : {};
    const response = await api.get('/live-location', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getETA = async (params) => {
  try {
    const response = await api.get('/eta', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

