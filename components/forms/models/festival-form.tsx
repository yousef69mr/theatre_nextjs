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
import { FestivalType } from "@/types";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

// import { SingleImageUpload } from "@/components/helpers/single-image-upload";
import { Loader2, Pencil } from "lucide-react";

import toast from "react-hot-toast";

import { Separator } from "@/components/ui/separator";

import { useTranslation } from "react-i18next";

import { actorSchema as festivalSchema } from "@/lib/validations/models/actor";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/stores/use-modal-store";
// import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import FileUpload from "@/components/helpers/file-upload";

import { useFestivalStore } from "@/hooks/stores/use-festivals-store";
import {
  createFestivalRequest,
  updateFestivalRequest,
} from "@/lib/api-calls/models/festival";
import { Textarea } from "@/components/ui/textarea";

interface FestivalFormProps extends HtmlHTMLAttributes<HTMLElement> {
  initialData: FestivalType | null;
  mode?: "modal" | "page";
}

type FestivalFormValues = Zod.infer<typeof festivalSchema>;
// const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const FestivalForm: FC<FestivalFormProps> = (props) => {
  const { initialData, className, mode = "page" } = props;
  const { onClose } = useModal();
  const addFestival = useFestivalStore((state) => state.addFestival);
  const updateFestival = useFestivalStore((state) => state.updateFestival);
  // console.log(initialData, Boolean(initialData));
  const [isEditing, setIsEditing] = useState<boolean>(!Boolean(initialData));

  const toggleEdit = () => setIsEditing((current) => !current);

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const router = useRouter();
  const params = useParams();
  // const pathname = usePathname();

  const { t } = useTranslation();

  const locale = params.locale;

  const form = useForm<FestivalFormValues>({
    resolver: zodResolver(festivalSchema),
    defaultValues: {
      ...initialData,
    },
  });

  const onSubmit = async (values: FestivalFormValues) => {
    setIsLoading(true);

    startTransition(() => {
      if (initialData) {
        // setIsEditing(true);
        updateFestivalRequest(values, initialData.id)
          // .then((response) => response.json())
          .then(async (data) => {
            // console.log("api success");
            toast.success(
              t("messages.updated", {
                ns: "constants",
                instance: t("festival.single", { ns: "constants" }),
              })
            );

            updateFestival(data);
            router.refresh();

            if (mode === "page") {
              // router.push(`/${locale}/admin/actors`);
            } else {
              onClose();
              form.reset();
            }
          })
          .catch((error:Error) => toast.error(error.message))
          .finally(() => {
            setIsLoading(false);
            setIsEditing(false);
          });
      } else {
        createFestivalRequest(values)
          // .then((response) => response.json())
          .then(async (data) => {
            toast.success(
              t("messages.created", {
                ns: "constants",
                instance: t("festival.single", { ns: "constants" }),
              })
            );

            addFestival(data);
            router.refresh();

            if (mode === "page") {
              router.push(`/${locale}/admin/festivals`);
            } else {
              onClose();
              form.reset();
            }
          })
          .catch((error:Error) => toast.error(error.message))
          .finally(() => setIsLoading(false));
      }
    });
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
  const isDisabled = isUploadingFile || isSubmitting;
  const isValid = form.formState.isValid;
  return (
    <div className={cn(initialData && "mt-6 border rounded-md p-4")}>
      {initialData && (
        <>
          <div className="font-medium flex items-center justify-between">
            <span className="capitalize">
              {t("festivalForm.titleText", { ns: "admin" })}
            </span>
            <Button onClick={toggleEdit} variant="ghost" className="capitalize">
              {isEditing ? (
                <>{t("actions.cancel", { ns: "common" })}</>
              ) : (
                <>
                  <Pencil className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
                  {t("actions.edit", {
                    instance: t("festivalForm.title", { ns: "admin" }),
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
          {initialData ? initialData.name : t("actorForm.inputs-default.name")}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("flex flex-col w-full space-y-4", className)}
          >
            <div
              className={cn(
                "flex w-full flex-wrap",
                mode === "modal" && "flex-col items-center "
              )}
            >
              <FormField
                control={form.control}
                name="imgUrl"
                render={({ field }) => (
                  <FormItem
                    className={cn("w-full", mode === "page" && "md:w-96")}
                  >
                    <FormLabel>
                      {t("forms.labels.image", {
                        ns: "constants",
                      })}
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        // className="max-h-40"
                        endpoint="festivalImage"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div
                className={cn(
                  "gap-4 flex-1",
                  // mode === "page" && "grid grid-cols-1 md:grid-cols-2",
                  mode === "modal" && "w-full"
                )}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("forms.labels.festivalName", { ns: "constants" })}
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isDisabled}
                          placeholder={t("forms.placeholder.festivalName", {
                            ns: "constants",
                          })}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        {t("forms.labels.description", {
                          ns: "constants",
                        })}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isDisabled}
                          placeholder={t("forms.placeholder.description", {
                            ns: "constants",
                          })}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />
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

export default FestivalForm;
