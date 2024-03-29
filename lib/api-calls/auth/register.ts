import { registerSchema } from "@/lib/validations/auth";
import axios from "axios";

export const registerRequest = (values: Zod.infer<typeof registerSchema>) => {
  return axios.post("/api/auth/register", {
    ...values,
  });
};
