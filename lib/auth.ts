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

export const userRoles = [
  UserRole.CAST_HEAD,
  UserRole.ACTOR,
  UserRole.CAST_VICE_PRESIDENT,
  UserRole.USER,
  UserRole.ADMIN,
];

export const executorRoles = [
  ExecutorRole.DIRECTOR,
  ExecutorRole.AUTHOR,
  ExecutorRole.EXECUTIVE_DIRECTOR,
  ExecutorRole.CO_DIRECTOR,
  ExecutorRole.ACTING_COACH,
  ExecutorRole.ADVERTISING,
  ExecutorRole.MUSIC_EXECUTION,
  ExecutorRole.SOUND_DESIGNER,
  ExecutorRole.LIGHTING_DESIGNER,
  ExecutorRole.ASSISTANT_DIRECTOR,
  ExecutorRole.DECOR_DESIGNER,
  ExecutorRole.CAMERA_MAN,
  ExecutorRole.COSMATICS_DESIGNER,
  ExecutorRole.COSTUME_DESIGNER,
  ExecutorRole.OTHER,
];

export const publicRoles = [UserRole.USER, UserRole.ACTOR];

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

export const isPublic = (loggedUserRole: UserRole) => {
  let isPublic = false;
  publicRoles.map((role) => {
    if (role === loggedUserRole) {
      isPublic = true;
      return;
    }
  });
  // console.log(isAdmin);

  return isPublic;
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
