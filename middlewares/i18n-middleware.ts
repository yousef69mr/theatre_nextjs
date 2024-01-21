import { i18nRouter } from "next-i18n-router";
import i18nConfig from "@/next-i18next.config";
import { NextRequest } from "next/server";


export function i18nMiddleware(request: NextRequest) {
  return i18nRouter(request, i18nConfig);
}