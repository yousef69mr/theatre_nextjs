
import { TwoFactorTokenType } from "@/types";
import axios from "axios";

export const getTwoFactorTokenByTokenRequest = async (token: string) => {
  try {
    const response = await axios.get(`/api/two-factor-tokens/${token}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByEmailRequest = async (email: string) => {
  try {
    const response = await axios.get(`/api/two-factor-tokens/${email}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const deleteTwoFactorTokenByIdRequest = async (id: string) => {
  try {
    const response = await axios.delete(`/api/two-factor-tokens/${id}`);
    return response.data;
  } catch (error) {
    return false;
  }
};

export const createTwoFactorTokenRequest = async ({
  email,
  expires,
  token,
}: TwoFactorTokenType) => {
  try {
    const response = await axios.post(`/api/two-factor-tokens`, {
      email,
      expires,
      token,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
