import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

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
