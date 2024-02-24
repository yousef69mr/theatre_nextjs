import i18nConfig from "./next-i18next.config";

/**
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/plays",
  "/plays/:playerId",
  "/actors",
  "/actors/:actorId",
  "/auth/new-verification",
];

export const routeChecker = (route: string, routesList: string[]) => {
  const routeSections = route.split("/");
  // if (routeSections[1] !== "api") {
  // if home with diffrent locale
  if (
    routeSections.length - 1 === 1 &&
    i18nConfig.locales.includes(routeSections[1])
  ) {
    return true;
  }

  if (routesList.includes(route)) {
    return true;
  }

  // console.log(routeSections);

  let isFound = true;

  routesList.forEach((route) => {
    if (!isFound) {
      return isFound;
    }
    const givenRouteSections = route.split("/");
    // console.log(givenRouteSections);
    // if (routeSections.length - 1 !== givenRouteSections.length) {
    //   continue;
    // }

    for (let index = 0; index < givenRouteSections.length; index++) {
      if (
        !givenRouteSections[index].startsWith(":") &&
        givenRouteSections[index] !== routeSections[index]
      ) {
        isFound = false;
      }
    }

    // console.log(isFound);
  });

  return isFound;
  // return routesList.includes(route);
  // }
};

/**
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * @type {string[]}
 *
 */
export const apiRoutesPrefix = "/api";

/**
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRCT = "/";

/**
 * @type {string}
 */
export const PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "";
