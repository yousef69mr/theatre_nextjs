"use client";

import { FC, HtmlHTMLAttributes, useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ActorType } from "@/types";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

// import { SingleImageUpload } from "@/components/helpers/single-image-upload";
import { Loader2, Pencil } from "lucide-react";

import toast from "react-hot-toast";

import { Separator } from "@/components/ui/separator";

import { useTranslation } from "react-i18next";

import { actorSchema } from "@/lib/validations/models/actor";
import { facultyCasts } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/stores/use-modal-store";
// import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import FileUpload from "@/components/helpers/file-upload";
import {
  createActorRequest,
  updateActorRequest,
} from "@/lib/api-calls/models/actor";
import { useActorStore } from "@/hooks/stores/use-actor-store";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { FacultyCast } from "@prisma/client";

interface ActorFormProps extends HtmlHTMLAttributes<HTMLElement> {
  initialData: ActorType | null;
  mode?: "modal" | "page";
}

type ActorFormValues = Zod.infer<typeof actorSchema>;
// const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const ActorForm: FC<ActorFormProps> = (props) => {
  const { initialData, className, mode = "page" } = props;
  const { onClose } = useModal();
  const addActor = useActorStore((state) => state.addActor);
  const updateActor = useActorStore((state) => state.updateActor);
  // console.log(initialData, Boolean(initialData));
  const [isEditing, setIsEditing] = useState<boolean>(
    !Boolean(initialData) || mode === "modal"
  );

  const toggleEdit = () => setIsEditing((current) => !current);

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const router = useRouter();
  const params = useParams();
  // const pathname = usePathname();

  const { t } = useTranslation();

  const locale = params.locale;

  const form = useForm<ActorFormValues>({
    resolver: zodResolver(actorSchema),
    defaultValues: {
      ...initialData,
      // facultyCast: initialData?.facultyCast || undefined,
      description: initialData?.description || undefined,
      startDate: new Date().toDateString(),
      nickname: initialData?.nickname || undefined,
    },
  });

  const onSubmit = async (values: ActorFormValues) => {
    setIsLoading(true);

    startTransition(() => {
      if (initialData) {
        // setIsEditing(true);
        updateActorRequest(values, initialData.id)
          // .then((response) => response.json())
          .then(async (data) => {
            // console.log("api success");
            toast.success(
              t("messages.updated", {
                ns: "constants",
                instance: t("actor.single", { ns: "constants" }),
              })
            );

            updateActor(data);
            router.refresh();

            if (mode === "page") {
              // router.push(`/${locale}/admin/actors`);
            } else {
              onClose();
              form.reset();
            }
          })
          .catch((error: Error) => toast.error(error.message))
          .finally(() => {
            setIsLoading(false);
            setIsEditing(false);
          });
      } else {
        createActorRequest(values)
          // .then((response) => response.json())
          .then(async (data) => {
            toast.success(
              t("messages.created", {
                ns: "constants",
                instance: t("actor.single", { ns: "constants" }),
              })
            );

            addActor(data);
            router.refresh();

            if (mode === "page") {
              router.push(`/${locale}/admin/actors`);
            } else {
              onClose();
              form.reset();
            }
          })
          .catch((error: Error) => toast.error(error.message))
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
    <div
      className={cn(
        initialData && mode !== "modal" && "mt-6 border rounded-md p-4"
      )}
    >
      {initialData && mode !== "modal" && (
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
          {initialData
            ? `${initialData.name} ${
                initialData.nickname ? `(${initialData.nickname})` : ""
              }`
            : t("actorForm.inputs-default.name")}
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
                mode === "modal" && "flex-col items-center"
              )}
            >
              <div className={cn("w-full", mode === "page" && "md:w-96")}>
                <FormField
                  control={form.control}
                  name="imgUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("forms.labels.image", {
                          ns: "constants",
                        })}
                      </FormLabel>
                      <FormControl>
                        <FileUpload
                          // className="max-h-40"
                          endpoint="actorImage"
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div
                className={cn(
                  "gap-4 flex-1",
                  mode === "page" && "grid md:grid-cols-2 items-center",
                  mode === "modal" && "w-full"
                )}
              >
                <div
                  className={cn(
                    "w-full flex items-center justify-center flex-wrap gap-x-1",
                    mode === "page" && "md:col-span-2"
                  )}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>
                          {t("forms.labels.actorName", { ns: "constants" })}
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isDisabled}
                            placeholder={t("forms.placeholder.actorName", {
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
                    name="nickname"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>
                          {t("forms.labels.nickname", { ns: "constants" })}
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isDisabled}
                            placeholder={t("forms.placeholder.nickname", {
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
                    name="facultyCast"
                    render={({ field }) => (
                      <FormItem className="self-end flex-1 shrink md:min-w-[50px]">
                        <FormLabel>
                          {t("forms.labels.facultyCast", { ns: "constants" })}
                        </FormLabel>
                        <Select
                          disabled={isDisabled}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("actions.select", {
                                  ns: "common",
                                  instance: t("forms.labels.facultyCast", {
                                    ns: "constants",
                                  }),
                                })}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {facultyCasts.map((faculty) => (
                              <SelectItem key={faculty} value={faculty}>
                                {t(`FacultyCast.${faculty}`, { ns: "common" })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!initialData && (
                  <div className="flex gap-x-2 w-full flex-wrap items-center md:col-span-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>
                            {t("forms.labels.startDate", {
                              ns: "constants",
                            })}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              disabled={isDisabled}
                              className="fill-input"
                              placeholder={t("forms.placeholder.startDate", {
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
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>
                            {t("forms.labels.endDate", {
                              ns: "constants",
                            })}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              disabled={isDisabled}
                              placeholder={t("forms.placeholder.endDate", {
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
                )}

                {(mode === "page" || initialData) && (
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="w-full md:col-span-2">
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
                )}

                {!initialData && (
                  <FormField
                    control={form.control}
                    name="isCastMember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start gap-x-2 space-x-3 space-y-0 rounded-md border p-4 md:col-span-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none ">
                          <FormLabel>
                            {t("forms.labels.isCastMember", {
                              ns: "constants",
                            })}
                          </FormLabel>
                          <FormDescription>
                            {t("forms.placeholder.isCastMember", {
                              ns: "constants",
                            })}
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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

export default ActorForm;
