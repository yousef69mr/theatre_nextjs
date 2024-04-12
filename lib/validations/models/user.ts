import { object, string } from "zod";

export const userSchema = object({
  email: string().email({ message: "Email is required" }),
  name: string().min(1, { message: "Name is required" }),
});
