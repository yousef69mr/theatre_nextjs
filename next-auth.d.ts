import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  isEditable: boolean;
  updatedAt: Date;
  createdAt: Date;
};

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: ExtendedUser;
  }
}
