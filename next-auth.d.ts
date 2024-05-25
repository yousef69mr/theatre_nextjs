import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  actorId?: string | null;
  executorId?: string | null;
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
