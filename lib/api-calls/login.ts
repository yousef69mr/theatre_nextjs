import { loginSchema } from "@/lib/validations";
import axios from "axios";

export const loginRequest = async (values: Zod.infer<typeof loginSchema>) => {
  return await axios.post("/api/auth/login", {
    ...values,
  });
};


