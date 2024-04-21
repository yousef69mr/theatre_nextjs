"use client";
import { Locale } from "@/next-i18next.config";
import React, { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, Plus } from "lucide-react";
// import RotateLoader from "react-spinners/RotateLoader";

import { useParams, useRouter } from "next/navigation";
import { UserType } from "@/types";
import { cn } from "@/lib/utils";
// import linkLocaleWrapper from "@/lib/link-locale-wrapper";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/helpers/heading";
import { useTranslation } from "react-i18next";
// import { DataTable } from "../../ui/data-table";
import UserTable from "@/components/tables/users/users-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { useUserStore } from "@/hooks/stores/use-user-store";
import TableSkeleton from "@/components/skeletons/table-skeleton";
import toast from "react-hot-toast";

interface UserListClientProps {
  data: UserType[];
}
const UserListClient: FC<UserListClientProps> = (props) => {
  const { data: users } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  // const setUsers = useUserStore((state) => state.setUsers);
  // const users = useUserStore((state) => state.users);

  const locale = params.locale as Locale;

  const headingTitle = `${t("user.plural", { ns: "constants" })} (${
    users?.length || 0
  })`;

  // useEffect(() => {
  //   setUsers(data);
  // }, [data]);

  useEffect(() => {
    router.prefetch(`/${locale}/admin/users/new`);
  }, [router]);

  const handleUserEdit = () => {
    // router.push(`/${locale}/admin/users/new`)
    toast.custom(
      <div className="bg-blue-500 rounded-full flex items-center gap-x-2 py-2 px-3">
        <HelpCircle className="w-5 h-5" />
        {t("messages.soon", { ns: "constants" })}
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={headingTitle} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleUserEdit}>
                <Plus className={cn("md:ltr:mr-2 md:rtl:ml-2 h-4 w-4")} />
                <span className="hidden md:block">
                  {t("actions.add", {
                    ns: "common",
                    instance: t("user.single", { ns: "constants" }),
                  })}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="md:hidden flex">
              <span>
                {t("actions.add", {
                  ns: "common",
                  instance: t("user.single", { ns: "constants" }),
                })}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Separator />
      {users ? (
        <>{Array.isArray(users) && <UserTable users={users} />}</>
      ) : (
        <div className=" w-full h-full">
          <TableSkeleton cols={5} rows={4} />
        </div>
      )}
    </>
  );
};

export default UserListClient;
