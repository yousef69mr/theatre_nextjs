
// import { db } from "@/lib/database";
import { TwoFactorConfirmationType } from "@/types";
import axios from "axios";

export const getTwoFactorConfirmationByUserIdRequest = async (
  userId: string
) => {
  try {
    const response = await axios.get(
      `/api/users/${userId}/two-factor-confirmation`
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const deleteTwoFactorConfirmationByIdRequest = async (id: string) => {
  try {
    const response = await axios.delete(`/api/two-factor-confirmations/${id}`);
    return response.data;
  } catch (error) {
    return false;
  }
};

export const createTwoFactorConfirmationRequest = async ({
  userId,
}: TwoFactorConfirmationType) => {
  try {
    const response = await axios.post("/api/two-factor-confirmations", {
      userId,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
