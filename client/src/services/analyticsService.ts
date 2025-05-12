import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const getClaimTrends = async () => {
  return axios.get(`${API_BASE_URL}/api/analytics/claim-trends`);
};

export const getClaimStatusBreakdown = async () => {
  return axios.get(`${API_BASE_URL}/api/analytics/claim-status-breakdown`);
};

export const getUserGrowth = async () => {
  return axios.get(`${API_BASE_URL}/api/analytics/user-growth`);
};
