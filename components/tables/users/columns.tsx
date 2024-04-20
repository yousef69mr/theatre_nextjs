"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { UserType } from "@/types";
import Image from "next/image";

// import ProgressList from "@/components/helpers/progress-list";
import CellAction from "./cell-actions";
import { useTranslation } from "react-i18next";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";

export type UserColumnDef<TData> = ColumnDef<TData> & {
  type: string; // Replace 'string' with the actual type you want to use
};

export const UserColumns: UserColumnDef<UserType>[] = [
  {
    accessorKey: "profileImg",
    header: () => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.profileImg", { ns: "constants" })}
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </Button>
      );
    },
    cell: ({ row }) => {
      const posterImgUrl = row.original.image
        ? row.original.image
        : "/default-profile.png";
      return (
        <Link href={posterImgUrl} target="_blank">
          <div className="relative h-24 w-24">
            {/* <AspectRatio ratio={2 / 3} className="bg-muted"> */}
            <Image
              src={posterImgUrl}
              fill
              alt="Image"
              className="rounded-md object-contain"
            />
            {/* </AspectRatio> */}
          </div>
        </Link>
      );
    },
    type: "image",
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.id", { ns: "constants" })}
          <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      );
    },
    type: "string",
    // cell: ({ row }) => <div>{row.original.employeeID.toString()}</div>,
  },
  {
    accessorKey: "userName",
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.userName", { ns: "constants" })}
          <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      );
    },
    type: "string",
  },
  {
    accessorKey: "tickets",
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.tickets", { ns: "constants" })}
          <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original as unknown as UserType;

      return (
        <div className="flex items-center justify-center">
          <p>{user.tickets.length}</p>
        </div>
      );
    },
    type: "string",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    type: "action",
  },
];
