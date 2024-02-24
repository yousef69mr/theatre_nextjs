"use client";

import { FC, HtmlHTMLAttributes, useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

// import { SingleImageUpload } from "@/components/helpers/single-image-upload";
import { Loader2, Pencil } from "lucide-react";

import toast from "react-hot-toast";

import { Separator } from "@/components/ui/separator";

import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/stores/use-modal-store";
// import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import FileUpload from "../../helpers/file-upload";
import {
  createActorRequest,
  updateActorRequest,
} from "@/lib/api-calls/models/actor";
import { useActorStore } from "@/hooks/stores/use-actor-store";
import { permisionsSchema } from "@/lib/validations";
import { Switch } from "../../ui/switch";

interface PermissionsFormProps extends HtmlHTMLAttributes<HTMLElement> {
  initialData: {
    isPublished: boolean;
  };
  mode?: "modal" | "page";
}

type PermissionsFormValues = Zod.infer<typeof permisionsSchema>;
// const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const PermissionsForm: FC<PermissionsFormProps> = (props) => {
  const { initialData, className, mode = "page" } = props;

  const updateActor = useActorStore((state) => state.updateActor);
  // console.log(initialData, Boolean(initialData));
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const params = useParams();
  // const pathname = usePathname();

  const { t } = useTranslation();

  const locale = params.locale;

  const form = useForm<PermissionsFormValues>({
    resolver: zodResolver(permisionsSchema),
    defaultValues: {
      ...initialData,
    },
  });

  const onSubmit = async (values: PermissionsFormValues) => {
    setIsLoading(true);

    startTransition(() => {});
  };

  // const description = initialData
  //   ? `Edit ${initialData.name} play`
  //   : "Add a new billboard";

  const submitBtn = initialData
    ? t("save.default", { ns: "constants" })
    : t("create.default", { ns: "constants" });
  const submitingText = initialData
    ? `${t("save.loading", { ns: "constants" })}...`
    : `${t("create.loading", { ns: "constants" })}...`;

  const isSubmitting = isPending || form.formState.isSubmitting || isLoading;
  const isDisabled = isSubmitting;
  const isValid = form.formState.isValid;
  return (
    <div className={cn(initialData && "mt-6 border rounded-md p-4")}>
      {initialData && (
        <>
          <div className="font-medium flex items-center justify-between">
            <span className="capitalize">
              {t("actorForm.titleText", { ns: "admin" })}
            </span>
            <Button onClick={toggleEdit} variant="ghost" className="capitalize">
              {isEditing ? (
                <>{t("actions.cancel", { ns: "common" })}</>
              ) : (
                <>
                  <Pencil className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
                  {t("actions.edit", {
                    instance: t("actorForm.title", { ns: "admin" }),
                    ns: "common",
                  })}
                </>
              )}
            </Button>
          </div>
          <Separator className="my-2" />
        </>
      )}

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData && "text-slate-500 italic"
          )}
        >
          {initialData.isPublished
            ? t("status.published")
            : t("status.published")}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("flex flex-col w-full space-y-4", className)}
          >
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("actorForm.inputs-label.name", { ns: "admin" })}
                  </FormLabel>
                  <FormControl>
                    <Switch
                      disabled={isDisabled}
                      checked={field.value}
                      // {...field}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full justify-end items-center">
              <Button type="submit" disabled={isDisabled || !isValid}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="ltr:mr-2 rtl:ml-2 h-4 w-4 animate-spin" />
                    {submitingText}
                  </>
                ) : (
                  submitBtn
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default PermissionsForm;
