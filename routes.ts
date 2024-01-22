import i18nConfig from "./next-i18next.config";

/**
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/plays",
  "/plays/:playerId",
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

  // console.log(routeSections);

  if (routesList.includes(route)) {
    return true;
  }

  let isFound = true;

  routesList.every((route) => {
    if (!isFound) {
      return false;
    }
    const givenRouteSections = route.split("/");
    // console.log(givenRouteSections);
    // if (routeSections.length - 1 !== givenRouteSections.length) {
    //   continue;
    // }
    for (let index in givenRouteSections) {
      if (givenRouteSections[index].startsWith(":")) {
        continue;
      }

      if (givenRouteSections[index] !== routeSections[index]) {
        return false;
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
 * @type {string}
 */
export const publicApis = [
  "/api/plays",
  "/api/users",
  "/api/users/:userId",
  "/api/verification-tokens",
  "/api/verification-tokens/:tokenId",
];

/**
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRCT = "/";
