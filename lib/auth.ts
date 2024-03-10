import { auth } from "@/auth";
import { ExecutorRole, UserRole } from "@prisma/client";

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user.role;
};

export const adminRoles = [
  UserRole.CAST_HEAD,
  UserRole.ADMIN,
  UserRole.CAST_VICE_PRESIDENT,
];

export const actorRoles = [
  UserRole.CAST_HEAD,
  UserRole.ACTOR,
  UserRole.CAST_VICE_PRESIDENT,
];

export const isAdmin = (loggedUserRole: UserRole) => {
  let isAdmin = false;
  adminRoles.map((role) => {
    if (role === loggedUserRole) {
      isAdmin = true;
      return;
    }
  });
  // console.log(isAdmin);

  return isAdmin;
};

export const mainExecutorsRoles = [ExecutorRole.DIRECTOR, ExecutorRole.AUTHOR];

export const isMainPlayExecutors = (executorRole: ExecutorRole) => {
  let isMainRole = false;
  mainExecutorsRoles.map((role) => {
    if (role === executorRole) {
      isMainRole = true;
      return;
    }
  });
  // console.log(isAdmin);

  return isMainRole;
};
