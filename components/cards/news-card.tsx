"use client";

import { FC, HTMLAttributes } from "react";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";

import { NewsCardType } from "@/types";

import Link from "next/link";
import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps extends HTMLAttributes<HTMLElement> {
  news: NewsCardType;
  // redirect?: "attend" | "default";
}
const NewsCard: FC<NewsCardProps> = (props) => {
  const { news, className } = props;

  const { t } = useTranslation();
  const params = useParams();
  const origin = useOrigin();

  const locale = params.locale as string;

  const imageUrl = news.imageUrl ?? "/play-poster-template.png";
  // console.log(origin);
  const href =
    news.type === "play"
      ? `${origin}/${locale}/plays/${news.id}`
      : news.type === "actor"
      ? `${origin}/${locale}/actors/${news.id}`
      : `#`;

  return (
    <Link href={href}>
      <DirectionAwareHover className={className} imageUrl={imageUrl} imageClassName={"object-cover scale-1"}>
        <div className="flex flex-col items-start justify-center px-2 space-y-2 w-full">
          <div className="flex items-center justify-start gap-x-2 max-w-full">
            <h3 className="text-sm md:!text-xl font-medium truncate">
              {news.title}
            </h3>
          </div>
          <Badge>{t(`${news.type}.single`, { ns: "constants" })}</Badge>
        </div>
      </DirectionAwareHover>
    </Link>
  );
};

export default NewsCard;
