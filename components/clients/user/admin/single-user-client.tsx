"use client";
import { Locale } from "@/next-i18next.config";
import React, { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Ticket, Trash } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { ActorType, ExecutorType, FestivalType, UserType } from "@/types";
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
import UserForm from "@/components/forms/models/user-form";
import { updateUserRequest } from "@/lib/api-calls/models/user";
import { useModal } from "@/hooks/stores/use-modal-store";
// import { useUserStore } from "@/hooks/stores/use-user-store";
import toast from "react-hot-toast";
import PermissionBox from "@/components/helpers/permission-box";

import Link from "next/link";

interface UserClientProps {
  user: UserType | null;
}
const UserClient: FC<UserClientProps> = (props) => {
  const { user } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();

  const locale = params.locale as Locale;

  const onOpen = useModal((state) => state.onOpen);
  // const updateUser = useUserStore((state) => state.updateUser);
  // const updateUser = useUserStore((state) => state.updateUser);
  // const setExecutors = useExecutorStore((state) => state.setExecutors);
  // const setActors = useActorStore((state) => state.setActors);
  // const setFestivals = useFestivalStore((state) => state.setFestivals);

  const headingTitle = user
    ? `${t("user.single", { ns: "constants" })} ${user.name}`
    : `${t("actions.add", {
        instance: t("user.single", { ns: "constants" }),
      })}`;

  const handleDelete = () => {
    onOpen("deleteUser", { user: user || undefined });
  };
  const handleBookTicket = () => {
    router.push(`/${locale}/users/${user?.id}/book-tickets`);
  };
  // const handlePublished = (isPublished: boolean) => {
  //   // onOpen("deleteActor", { actor: actor });
  //   if (user) {
  //     updateUserRequest(
  //       {
  //         name: user.name,
  //         // posterImgUrl: user.posterImgUrl,
  //         // executorId: user.director?.id as string,
  //         showTime: new Date(),
  //         festivalId: "__",
  //         // description: user.description,
  //         isPublished,
  //       },
  //       user.id
  //     )
  //       .then((response) => response.json())
  //       .then(async (data) => {
  //         // console.log("api success");
  //         data.isPublished
  //           ? toast.success(
  //               t("messages.published", {
  //                 ns: "constants",
  //                 instance: t("user.single", { ns: "constants" }),
  //               })
  //             )
  //           : toast.success(
  //               t("messages.unpublished", {
  //                 ns: "constants",
  //                 instance: t("user.single", { ns: "constants" }),
  //               })
  //             );

  //         updateUser(data);
  //         router.refresh();
  //       })
  //       .catch((error) => toast.error("something went wrong"));
  //   }
  // };

  // useEffect(() => {
  //   user && updateUser(user);
  // }, [user]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {user && (
          <>
            <Link href={`/${locale}/users/${user?.id}`}>
              <Heading title={headingTitle} />
            </Link>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleBookTicket}
                      variant={"outline"}
                      className="hover:text-orange-300 hover:border-orange-300"
                    >
                      <Ticket
                        className={cn(
                          "md:ltr:mr-2 md:rtl:ml-2 h-4 w-4 text-orange-300"
                        )}
                      />
                      <span className="hidden md:block">
                        {t("actions.book", {
                          ns: "common",
                          instance: t("ticket.single", { ns: "constants" }),
                        })}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="md:hidden flex">
                    <span>
                      {t("actions.book", {
                        ns: "common",
                        instance: t("ticket.single", { ns: "constants" }),
                      })}
                    </span>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleDelete} variant={"destructive"}>
                      <Trash
                        className={cn("md:ltr:mr-2 md:rtl:ml-2 h-4 w-4")}
                      />
                      <span className="hidden md:block">
                        {t("actions.delete", {
                          ns: "common",
                          instance: t("user.single", { ns: "constants" }),
                        })}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="md:hidden flex">
                    <span>
                      {t("actions.delete", {
                        ns: "common",
                        instance: t("user.single", { ns: "constants" }),
                      })}
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
      </div>
      <Separator />
      <UserForm initialData={user} />
      {user && (
        <>
          <Separator className="bg-red-100 dark:bg-red-700/15" />
          <PermissionBox handleDelete={handleDelete} type={"user"} />
        </>
      )}
    </div>
  );
};

export default UserClient;
