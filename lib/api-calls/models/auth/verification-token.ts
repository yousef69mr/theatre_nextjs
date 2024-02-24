
import { VerificationTokenType } from "@/types";
import axios from "axios";

export const getVerificationTokenByTokenRequest = async (token: string) => {
  try {
    const response = await axios.get(`/api/verification-tokens/${token}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByEmailRequest = async (email: string) => {
  try {
    const response = await axios.get(`/api/verification-tokens/${email}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const deleteVerificationTokenByIdRequest = async (id: string) => {
  try {
    const response = await axios.delete(`/api/verification-tokens/${id}`);
    return response.data;
  } catch (error) {
    return false;
  }
};

export const createVerificationTokenRequest = async ({
  email,
  expires,
  token,
}: VerificationTokenType) => {
  try {
    const response = await axios.post("/api/verification-tokens", {
      email,
      expires,
      token,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
