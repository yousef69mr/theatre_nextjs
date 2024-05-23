"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { ActorType } from "@/types";
import Image from "next/image";

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import ProgressList from "@/components/helpers/progress-list";
import CellAction from "./cell-actions";
import { useTranslation } from "react-i18next";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
// import { ExecutorRole } from "@prisma/client";
import Link from "next/link";
import { useParams } from "next/navigation";

export type ActorColumnDef<TData> = ColumnDef<TData>;

export const ActorColumns: ActorColumnDef<ActorType>[] = [
  {
    meta: {
      type: "image",
    },
    accessorKey: "profileImg",
    header: () => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          className="hover:bg-inherit hover:text-inherit"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.profileImg", { ns: "constants" })}
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </Button>
      );
    },
    cell: ({ row }) => {
      const imgUrl = row.original.imgUrl;
      return (
        <div className="relative h-24 w-24">
          {/* <AspectRatio ratio={2 / 3} className="bg-muted"> */}
          <Link href={imgUrl} target="_blank">
            <Image
              src={imgUrl}
              fill
              alt="Image"
              className="rounded-md object-contain"
            />
          </Link>
          {/* </AspectRatio> */}
        </div>
      );
    },
  },

  {
    accessorKey: "actorName",
    accessorFn: (originalRow) => {
      const actor = originalRow;
      const actorName = `${actor.name} ${
        actor.nickname ? `(${actor.nickname})` : ""
      }`;
      return actorName;
    },
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.actorName", { ns: "constants" })}
          <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row, getValue }) => {
      const actor = row.original;

      const params = useParams();
      const locale = params.locale as string;
      return (
        <Link
          href={`/${locale}/actors/${actor.id}`}
          className="hover:text-orange-300"
        >
          <div className="flex items-center justify-center">
            <p>{getValue() as string}</p>
          </div>
        </Link>
      );
    },
    meta: {
      type: "string",
    },
  },

  {
    accessorKey: "awards",
    accessorFn: (originalRow) => {
      const awards = originalRow.awards;

      return awards.length || 0;
    },
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.awards", { ns: "constants" })}
          <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const awardsNum = getValue() as number;
      return (
        <div className="flex items-center justify-center">
          <p>{awardsNum}</p>
        </div>
      );
    },
    meta: {
      type: "number",
    },
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
    meta: {
      type: "string",
    },
    // cell: ({ row }) => <div>{row.original.employeeID.toString()}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    meta: {
      type: "actions",
    },
  },
];
