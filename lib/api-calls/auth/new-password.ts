import axios from "axios";
import { newPasswordSchema } from "@/lib/validations/auth";

export const newPasswordRequest = (
  values: Zod.infer<typeof newPasswordSchema>,
  token: string
) => {
  return axios.post("/api/auth/new-password", {
    ...values,
    token,
  });
};
