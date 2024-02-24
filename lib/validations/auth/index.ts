import { UserRole } from "@prisma/client";
import { object, string, optional, enum as enum_, boolean } from "zod";

export const loginSchema = object({
  email: string().email({ message: "Email is required" }),
  password: string().min(1, { message: "password is required" }),
  code: optional(string()),
});

export const registerSchema = object({
  email: string().email({ message: "Email is required" }),
  password: string().min(6, { message: "min 6 characters required" }),
  name: string().min(1, { message: "Name is required" }),
});

export const resetSchema = object({
  email: string().email({ message: "Email is required" }),
});

export const newPasswordSchema = object({
  password: string().min(6, { message: "min 6 characters required" }),
  confirmPassword: string().min(6, { message: "min 6 characters required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const settingsSchema = object({
  name: optional(string()),
  role: enum_([UserRole.ADMIN, UserRole.USER,UserRole.ACTOR,UserRole.CAST_HEAD,UserRole.CAST_VICE_PRESIDENT]),
  email: optional(string().email()),
  password: optional(string().min(6)),
  newPassword: optional(string().min(6)),
  isTwoFactorEnabled: optional(boolean()),
})
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New Password is required",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    } 
  );
