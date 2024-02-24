"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

interface PermissionBoxProps {
  handleDelete: () => void;
  type: "actor" | "play" | "executor";
  isPublished: boolean;
  handleIsPublished: (isPublished: boolean) => void;
}
const PermissionBox: FC<PermissionBoxProps> = (props) => {
  const { handleDelete, type, handleIsPublished, isPublished } = props;

  const { t } = useTranslation();

  return (
    <div className="mt-6 border rounded-md p-4 space-y-2">
      <div className="flex flex-row items-center justify-between rounded-lg border p-4 flex-wrap">
        <div className="space-y-0.5">
          <Label htmlFor="isPublished" className="text-lg">
            {t("permissions.publish.title", {
              ns: "admin",
              instance: t(`${type}.single`, { ns: "constants" }),
            })}
          </Label>
          <p className="text-sm text-muted-foreground">
            {t("permissions.publish.description", {
              ns: "admin",
              instance: t(`${type}.single`, { ns: "constants" }),
            })}
          </p>
        </div>
        <Switch
          id="isPublished"
          checked={isPublished}
          onCheckedChange={(event) => {
            // console.log(event);
            handleIsPublished(event);
          }}
        />
      </div>
      <div className="flex flex-row items-center justify-between rounded-lg border p-4 flex-wrap">
        <div className="space-y-0.5">
          <Label
            htmlFor="delete"
            className="font-medium text-lg text-destructive dark:text-red-500"
          >
            {t("actions.delete", {
              ns: "common",
              instance: t(`${type}.single`, { ns: "constants" }),
            })}
          </Label>
          <p className="text-sm text-muted-foreground"></p>
        </div>
        <Button
          id="delete"
          type="button"
          variant={"outline_destructive"}
          onClick={handleDelete}
        >
          {t("delete.default", { ns: "constants" })}
        </Button>
      </div>
    </div>
  );
};

export default PermissionBox;
