import { settingsSchema } from "@/lib/validations";
import axios from "axios";

export const settingsRequest = async (
  values: Zod.infer<typeof settingsSchema>
) => {
  return await axios.post("/api/auth/settings", {
    ...values,
  });
};
