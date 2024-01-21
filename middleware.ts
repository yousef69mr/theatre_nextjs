import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRCT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  routeChecker,
} from "@/routes";
import i18nConfig, { isValidLocale } from "./next-i18next.config";
import { i18nMiddleware } from "./middlewares/i18n-middleware";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, cookies } = req;

  const currentLocale = cookies.get("i18next") || null;

  // console.log(currentLanguage)
  const locale =
    currentLocale &&
    isValidLocale(currentLocale.value) &&
    currentLocale.value !== i18nConfig.defaultLocale
      ? `/${currentLocale.value}`
      : ``;
  // console.log("================");
  // console.log(locale);

  const isLoggedIn = !!req.auth;

  const pathname = i18nConfig.locales.includes(nextUrl.pathname.split("/")[1])
    ? nextUrl.pathname.replace(/^\/([^\/]+)\/(.*)$/, "/$2")
    : nextUrl.pathname;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  const isPublicRoute = routeChecker(pathname, publicRoutes);
  const isAuthRoute = authRoutes.includes(pathname);
  
  if (isApiAuthRoute) {
    return null;
  }
  
  // console.log(nextUrl.pathname, nextUrl.pathname.split("/")[1]);
  
  // console.log(pathname);
  // console.log(isPublicRoute, isAuthRoute);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(
        new URL(locale.concat(DEFAULT_LOGIN_REDIRCT), nextUrl)
      );
    }
    return i18nMiddleware(req);
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(locale.concat("/auth/login"), nextUrl));
  }

  return i18nMiddleware(req);
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
