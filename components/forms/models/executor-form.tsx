"use client";

import {
  FC,
  HtmlHTMLAttributes,
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ExecutorType } from "@/types";
import { useForm } from "react-hook-form";
import { useParams, usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

// import { SingleImageUpload } from "@/components/helpers/single-image-upload";
import { Loader2, Pencil } from "lucide-react";

import {
  createExecutorRequest,
  updateExecutorRequest,
} from "@/lib/api-calls/models/executor";

import toast from "react-hot-toast";

import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTranslation } from "react-i18next";

import { executorSchema } from "@/lib/validations/models/executor";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/stores/use-modal-store";
// import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import { useExecutorStore } from "@/hooks/stores/use-executor-store";
import FileUpload from "../../helpers/file-upload";
import { Textarea } from "@/components/ui/textarea";
import { facultyCasts } from "@/lib/constants";

interface ExecutorFormProps extends HtmlHTMLAttributes<HTMLElement> {
  initialData: ExecutorType | null;
  mode?: "modal" | "page";
}

type ExecutorFormValues = Zod.infer<typeof executorSchema>;
// const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const ExecutorForm: FC<ExecutorFormProps> = (props) => {
  const { initialData, className, mode = "page" } = props;

  const { onClose } = useModal();
  const addExecutor = useExecutorStore((state) => state.addExecutor);
  const updateExecutor = useExecutorStore((state) => state.updateExecutor);

  const [isEditing, setIsEditing] = useState<boolean>(!Boolean(initialData));

  const toggleEdit = () => setIsEditing((current) => !current);

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const { t } = useTranslation();

  const locale = params.locale;

  const form = useForm<ExecutorFormValues>({
    resolver: zodResolver(executorSchema),
    defaultValues: {
      ...initialData,
      nickname: initialData?.nickname || undefined,
      description: initialData?.description || undefined,
    },
  });

  const onSubmit = async (values: ExecutorFormValues) => {
    setIsLoading(true);
    startTransition(() => {
      if (initialData) {
        updateExecutorRequest(values, initialData.id)
          // .then((response) => response.json())
          .then(async (data) => {
            // console.log("api success");
            toast.success(
              t("messages.updated", {
                ns: "constants",
                instance: t("executor.single", { ns: "constants" }),
              })
            );

            updateExecutor(data);
            router.refresh();
            if (mode === "page") {
              // router.push(`/${locale}/admin/executors`);
            } else {
              onClose();
              form.reset();
            }
          })
          .catch((error: Error) => {
            toast.error(error.message);
          })
          .finally(() => {
            setIsLoading(false);
            setIsEditing(false);
          });
      } else {
        createExecutorRequest(values, pathname)
          // .then((response) => response.json())
          .then(async (data) => {
            // console.log("api success");

            //   await confirmFileUpload(data.posterImgUrl);
            // } catch (error) {
            //   toast.error("image save error");
            // }

            toast.success(
              t("messages.created", {
                ns: "constants",
                instance: t("executor.single", { ns: "constants" }),
              })
            );

            addExecutor(data);
            router.refresh();

            if (mode === "page") {
              router.push(`/${locale}/admin/executors`);
            } else {
              onClose();
              form.reset();
            }
          })
          .catch((error) => toast.error(error))
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
              {t("executorForm.titleText", { ns: "admin" })}
            </span>
            <Button onClick={toggleEdit} variant="ghost" className="capitalize">
              {isEditing ? (
                <>{t("actions.cancel", { ns: "common" })}</>
              ) : (
                <>
                  <Pencil className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
                  {t("actions.edit", {
                    instance: t("executorForm.title", { ns: "admin" }),
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
            className={cn("w-full space-y-4", className)}
          >
            <div
              className={cn(
                "flex w-full flex-wrap",
                mode === "modal" && "flex-col items-center"
              )}
            >
              <FormField
                control={form.control}
                name="imgUrl"
                render={({ field }) => (
                  <FormItem
                    className={cn("w-full ", mode === "page" && "md:w-96")}
                  >
                    <FormLabel>
                      {t("executorForm.inputs-label.image", {
                        ns: "admin",
                      })}
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        className="h-30"
                        endpoint="executorImage"
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

export default ExecutorForm;
