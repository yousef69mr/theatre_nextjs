import { db } from "@/lib/database";
import axios from "axios";

export const getAccountsByUserId = async (userId: string) => {
  try {
    const response = await axios.get(`/api/users/${userId}/accounts`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const deleteAccountsByUserId = async (userId: string) => {
  try {
    const response = await axios.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    return false;
  }
};
