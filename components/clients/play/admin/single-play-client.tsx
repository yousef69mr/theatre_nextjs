"use client";
import { Locale } from "@/next-i18next.config";
import React, { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { ActorType, ExecutorType, FestivalType, PlayType } from "@/types";
import { cn } from "@/lib/utils";
// import linkLocaleWrapper from "@/lib/link-locale-wrapper";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/helpers/heading";
import { useTranslation } from "react-i18next";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PlayForm from "@/components/forms/models/play-form";
import { updatePlayRequest } from "@/lib/api-calls/models/play";
import { useModal } from "@/hooks/stores/use-modal-store";
import { usePlayStore } from "@/hooks/stores/use-play-store";
import toast from "react-hot-toast";
import PermissionBox from "@/components/helpers/permission-box";
import { useExecutorStore } from "@/hooks/stores/use-executor-store";
import { useFestivalStore } from "@/hooks/stores/use-festivals-store";
import ActorInPlayControl from "@/components/controls/actor-in-play-control";
import FestivalPlayControl from "@/components/controls/festival-play-control";
import { useActorStore } from "@/hooks/stores/use-actor-store";
import Link from "next/link";
import ExecutorInPlayControl from "@/components/controls/executor-in-play-control";

interface PlayClientProps {
  play: PlayType | null;
  festivals: FestivalType[];
  actors: ActorType[];
  executors: ExecutorType[];
}
const PlayClient: FC<PlayClientProps> = (props) => {
  const { play, festivals, executors, actors } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();

  const locale = params.locale as Locale;

  const onOpen = useModal((state) => state.onOpen);
  // const updatePlay = usePlayStore((state) => state.updatePlay);
  const updatePlay = usePlayStore((state) => state.updatePlay);
  const setExecutors = useExecutorStore((state) => state.setExecutors);
  const setActors = useActorStore((state) => state.setActors);
  const setFestivals = useFestivalStore((state) => state.setFestivals);

  const headingTitle = play
    ? `${t("play.single", { ns: "constants" })} ${play.name}`
    : `${t("actions.add", {
        instance: t("play.single", { ns: "constants" }),
      })}`;

  const handleDelete = () => {
    onOpen("deletePlay", { play: play || undefined });
  };
  const handlePublished = (isPublished: boolean) => {
    // onOpen("deleteActor", { actor: actor });
    if (play) {
      updatePlayRequest(
        {
          name: play.name,
          posterImgUrl: play.posterImgUrl,
          executorId: play.director?.id as string,
          showTime: new Date(),
          festivalId: "__",
          description: play.description,
          isPublished,
        },
        play.id
      )
        .then((response) => response.json())
        .then(async (data) => {
          // console.log("api success");
          data.isPublished
            ? toast.success(
                t("messages.published", {
                  ns: "constants",
                  instance: t("play.single", { ns: "constants" }),
                })
              )
            : toast.success(
                t("messages.unpublished", {
                  ns: "constants",
                  instance: t("play.single", { ns: "constants" }),
                })
              );

          updatePlay(data);
          router.refresh();
        })
        .catch((error) => toast.error("something went wrong"));
    }
  };

  useEffect(() => {
    setExecutors(executors);
  }, [executors]);

  useEffect(() => {
    setActors(actors);
  }, [actors]);

  useEffect(() => {
    setFestivals(festivals);
  }, [festivals]);

  useEffect(() => {
    play && updatePlay(play);
  }, [play]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {play && (
          <>
            <Link href={`/${locale}/plays/${play.id}`}>
              <Heading title={headingTitle} />
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleDelete}>
                    <Trash className={cn("md:ltr:mr-2 md:rtl:ml-2 h-4 w-4")} />
                    <span className="hidden md:block">
                      {t("actions.delete", {
                        ns: "common",
                        instance: t("play.single", { ns: "constants" }),
                      })}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="md:hidden flex">
                  <span>
                    {t("actions.delete", {
                      ns: "common",
                      instance: t("play.single", { ns: "constants" }),
                    })}
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
      <Separator />
      <PlayForm initialData={play} />
      {play && (
        <>
          <Separator className="bg-red-100 dark:bg-red-700/15" />
          <FestivalPlayControl
            festivalPlayList={play.festivals}
            type="festival"
          />
          <Separator className="bg-red-100 dark:bg-red-700/15" />
          <ActorInPlayControl actorInPlayList={play.actors} type="actor" />
          <Separator className="bg-red-100 dark:bg-red-700/15" />
          <ExecutorInPlayControl
            executorInPlayList={play.executors}
            type="executor"
          />
          <Separator className="bg-red-100 dark:bg-red-700/15" />
          <PermissionBox
            handleDelete={handleDelete}
            type={"play"}
            isPublished={play.isPublished}
            handleIsPublished={handlePublished}
          />
        </>
      )}
    </div>
  );
};

export default PlayClient;
