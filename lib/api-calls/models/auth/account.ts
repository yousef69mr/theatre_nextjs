import axios from "axios";

export const getAccountsByUserIdRequest = async (userId: string) => {
  try {
    const response = await axios.get(`/api/users/${userId}/accounts`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const deleteAccountsByUserIdRequest = async (userId: string) => {
  try {
    const response = await axios.delete(`/api/users/${userId}/accounts`);
    return response.data;
  } catch (error) {
    return false;
  }
};
