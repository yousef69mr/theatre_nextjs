
import { PasswordRestTokenType } from "@/types";
import axios from "axios";

export const getPasswordResetTokenByTokenRequest = async (token: string) => {
  try {
    const response = await axios.get(`/api/password-reset-tokens/${token}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmailRequest = async (email: string) => {
  try {
    const response = await axios.get(`/api/password-reset-tokens/${email}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const deletePasswordResetTokenByIdRequest = async (id: string) => {
  try {
    const response = await axios.delete(`/api/password-reset-tokens/${id}`);
    return response.data;
  } catch (error) {
    return false;
  }
};

export const createPasswordResetTokenRequest = async ({
  email,
  expires,
  token,
}: PasswordRestTokenType) => {
  try {
    const response = await axios.post(`/api/password-reset-tokens`, {
      email,
      expires,
      token,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
