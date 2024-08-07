"use client";
// import { Locale } from "@/next-i18next.config";
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
import ActorForm from "@/components/forms/models/actor-form";
import { useModal } from "@/hooks/stores/use-modal-store";
import PermissionBox from "../../../helpers/permission-box";
import { updateActorRequest } from "@/lib/api-calls/models/actor";
import toast from "react-hot-toast";
import { useActorStore } from "@/hooks/stores/use-actor-store";
import ActorInPlayControl from "../../../controls/actor-in-play-control";
import { useFestivalStore } from "@/hooks/stores/use-festivals-store";
import { usePlayStore } from "@/hooks/stores/use-play-store";
// import { useExecutorStore } from "@/hooks/stores/use-executor-store";
import CastMemberControl from "@/components/controls/cast-member-control";
import { UserRole } from "@prisma/client";
import { Locale } from "@/next-i18next.config";
import Link from "next/link";

interface ActorClientProps {
  actor: ActorType | null;
  festivals: FestivalType[];
  plays: PlayType[];
  // executors: ExecutorType[];
}
const ActorClient: FC<ActorClientProps> = (props) => {
  const { actor, festivals, plays } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const onOpen = useModal((state) => state.onOpen);
  const updateActor = useActorStore((state) => state.updateActor);
  const setFestivals = useFestivalStore((state) => state.setFestivals);
  const setPlays = usePlayStore((state) => state.setPlays);
  // const setExecutors = useExecutorStore((state) => state.setExecutors);

  const locale = params.locale as Locale;

  const headingTitle = actor
    ? `${t("actor.single", { ns: "constants" })} ${actor.name} ${
        actor.nickname ? `(${actor.nickname})` : ""
      }`
    : `${t("actions.add", {
        instance: t("actor.single", { ns: "constants" }),
      })}`;

  const handleDelete = () => {
    onOpen("deleteActor", { actor: actor || undefined });
  };
  const handlePublished = (isPublished: boolean) => {
    // onOpen("deleteActor", { actor: actor });
    if (actor) {
      const isCastMember = Boolean(
        actor.castMembers.find(
          (castMember) => castMember.role === UserRole.ACTOR
        )
      );
      updateActorRequest(
        {
          name: actor.name,
          imgUrl: actor.imgUrl || undefined,
          startDate: "",
          description: actor.description,
          facultyCast: actor.facultyCast,
          isCastMember,
          isPublished,
        },
        actor.id
      )
        // .then((response) => response.json())
        .then(async (data) => {
          // console.log("api success");
          data.isPublished
            ? toast.success(
                t("messages.published", {
                  ns: "constants",
                  instance: t("actor.single", { ns: "constants" }),
                })
              )
            : toast.success(
                t("messages.unpublished", {
                  ns: "constants",
                  instance: t("actor.single", { ns: "constants" }),
                })
              );

          updateActor(data);
          router.refresh();
        })
        .catch((error) => toast.error(error));
    }
  };

  useEffect(() => {
    setFestivals(festivals);
  }, [festivals]);

  useEffect(() => {
    setPlays(plays);
  }, [plays]);

  useEffect(() => {
    actor && updateActor(actor);
  }, [actor]);
  // useEffect(() => {
  //   setExecutors(executors);
  // }, [executors]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {actor ? (
          <>
            <Link href={`/${locale}/actors/${actor.id}`}>
              <Heading title={headingTitle} />
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => onOpen("deleteActor", { actor })}>
                    <Trash className={cn("md:ltr:mr-2 md:rtl:ml-2 h-4 w-4")} />
                    <span className="hidden md:block">
                      {t("actions.delete", {
                        ns: "common",
                        instance: t("actor.single", { ns: "constants" }),
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
        ) : (
          <Heading title={headingTitle} />
        )}
      </div>
      <Separator />
      <ActorForm initialData={actor} />
      {actor && (
        <>
          <Separator className="bg-red-100 dark:bg-red-700/15" />
          <ActorInPlayControl actorInPlayList={actor.plays} type="play" />

          <Separator className="bg-red-100 dark:bg-red-700/15" />
          <CastMemberControl castMembers={actor.castMembers} />
          <Separator className="bg-red-100 dark:bg-red-700/15" />
          <PermissionBox
            handleDelete={handleDelete}
            type={"actor"}
            isPublished={actor.isPublished}
            handleIsPublished={handlePublished}
          />
        </>
      )}
    </div>
  );
};

export default ActorClient;
