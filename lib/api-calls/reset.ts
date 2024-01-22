import { resetSchema } from "@/lib/validations";
import axios from "axios";

export const resetRequest = (values: Zod.infer<typeof resetSchema>) => {
  return axios.post("/api/auth/reset", {
    ...values,
  });
};
