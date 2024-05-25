import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/database";
import authConfig from "@/auth.config";
import { getUserById } from "./lib/actions/models/user";
import { UserRole } from "@prisma/client";
import {
  deleteTwoFactorConfirmationById,
  getTwoFactorConfirmationByUserId,
} from "@/lib/actions/models/two-factor-confirmation";
import { getAccountsByUserId } from "./lib/actions/models/account";
import { UserType } from "./types";
import { ExtendedUser } from "./next-auth";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // debug: true,
  pages: {
    signOut: "/",
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }
      const existingUser = await getUserById(user.id);

      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) {
          return false;
        }

        //delete two factor confirmation for next sign in
        await deleteTwoFactorConfirmationById(twoFactorConfirmation.id);
      }
      return true;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }
      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }

      const existingAccounts = await getAccountsByUserId(existingUser.id);
      // console.log(existingAccounts);

      token.isOAuth = existingAccounts.length !== 0;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.isEditable = existingUser.isEditable;
      token.executorId = existingUser.executor?.executorId;
      token.actorId = existingUser.actor?.actorId;

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.role) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.isEditable = token.isEditable as boolean;
        session.user.actorId = token.actorId as string;
        session.user.executorId = token.executorId as string;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
