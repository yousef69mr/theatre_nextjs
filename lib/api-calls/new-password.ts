import axios from "axios";
import { newPasswordSchema } from "@/lib/validations";

export const newPasswordRequest = (
  values: Zod.infer<typeof newPasswordSchema>,
  token: string
) => {
  return axios.post("/api/auth/new-password", {
    ...values,
    token,
  });
};
