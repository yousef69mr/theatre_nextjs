import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRCT,
  apiRoutesPrefix,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  routeChecker,
} from "@/routes";
import i18nConfig, { isValidLocale } from "@/next-i18next.config";
import { i18nMiddleware } from "@/middlewares/i18n-middleware";

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

  const isAuthRoute = authRoutes.includes(pathname);
  // const isAdminRoute = nextUrl.pathname.startsWith(adminRoutesPrefix);

  const isPublicApiRoute = nextUrl.pathname.startsWith(apiRoutesPrefix);

  if (isApiAuthRoute || isPublicApiRoute) {
    return null;
  }

  // console.log(nextUrl);
  // console.log(pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      const url = new URL(locale.concat(DEFAULT_LOGIN_REDIRCT), nextUrl);
      url.searchParams.append("redirect", locale.concat(pathname));
      // console.log(url.toString());
      return Response.redirect(url.toString());
    }
    return i18nMiddleware(req);
  }

  const isPublicRoute = routeChecker(pathname, publicRoutes);
  // if (isApiAuthRoute) {
  //   return null;
  // }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(locale.concat("/auth/login"), nextUrl));
  }

  return i18nMiddleware(req);
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
