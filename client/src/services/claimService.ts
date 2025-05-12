import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

interface Claim {
  policyId: string;
  treatmentDetails: string;
  amountRequested: number;
  lossDate: Date;
  lossTime: Date;
}

export const getAllClaims = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/claims`);
  return response;
};

export const getClaimById = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/claims/${id}`);
  return response;
};

export const createClaim = async (claim: Claim) => {
  const response = await axios.post(`${API_BASE_URL}/api/claims`, claim);
  return response;
};

export const approveClaim = async (claimId: number) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/claims/${claimId}/approve`
  );
  return response;
};

export const rejectClaim = async (claimId: number) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/claims/${claimId}/reject`
  );
  return response;
};

export const deleteClaim = async (claimId: number) => {
  return axios.delete(`${API_BASE_URL}/api/claims/${claimId}`);
};

export const getMyClaims = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/claims/my`);
  return response;
};
