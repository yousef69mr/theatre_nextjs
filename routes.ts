import i18nConfig from "./next-i18next.config";

/**
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/plays",
  "/plays/:playId",
  "/plays/:playId/watch",
  "/actors",
  "/actors/:actorId",
  "/executors",
  "/executors/:executorId",
  "/tickets/:ticketId",
  "/attend-play",
  "/auth/new-verification",
];

export const routeChecker = (route: string, routesList: string[]) => {
  // console.log(route);
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

  let isFound = false;

  for (const route of routesList) {
    const givenRouteSections = route.split("/");
    // console.log(givenRouteSections);
    if (routeSections.length !== givenRouteSections.length) {
      continue;
    }
    const lengthLimit = routeSections.length;
    // if (routeSections.length > lengthLimit) {
    //   continue;
    // }

    for (let index = 0; index < lengthLimit; index++) {
      if (
        !givenRouteSections[index].startsWith(":") &&
        givenRouteSections[index] !== routeSections[index]
      ) {
        break;
      }

      if (index === givenRouteSections.length - 1 && !isFound) {
        isFound = true;
        // console.log(route);
      }
    }

    if (isFound) {
      break;
    }
  }

  return isFound;
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
