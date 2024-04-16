"use client";

import {
  FC,
  HtmlHTMLAttributes,
  useEffect,
  useReducer,
  useState,
  useTransition,
} from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ExecutorInPlayType, ExecutorType, FestivalType, UserType } from "@/types";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

// import { SingleImageUpload } from "@/components/helpers/single-image-upload";
import { Check, ChevronsUpDown, Loader2, PlusCircle } from "lucide-react";

import toast from "react-hot-toast";

import { Separator } from "@/components/ui/separator";

import { useTranslation } from "react-i18next";

import {
  executorInPlaySchema,
  userExecutorLinkSchema,
} from "@/lib/validations/actions/link-model-actions";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/stores/use-modal-store";

import {
  createExecutorInPlayRequest,
  updateExecutorInPlayRequest,
} from "@/lib/api-calls/actions/executor-in-play";

import { usePlayStore } from "@/hooks/stores/use-play-store";
import { useFestivalStore } from "@/hooks/stores/use-festivals-store";
import { useExecutorStore } from "@/hooks/stores/use-executor-store";
import { MultiInput } from "@/components/ui/multi-input";
import {
  createUserExecutorLinkRequest,
  getRemainingUserExecutorLinkRequest,
} from "@/lib/api-calls/actions/user-executor-link";
import { isAdmin } from "@/lib/auth";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";

interface LinkUserExecutorFormProps extends HtmlHTMLAttributes<HTMLElement> {
  initialData: {
    executorId?: string;
    userId?: string;
  } | null;
  mode?: "modal" | "page";
}

type LinkUserExecutorFormValues = Zod.infer<typeof userExecutorLinkSchema>;

const LinkUserExecutorForm: FC<LinkUserExecutorFormProps> = (props) => {
  const { initialData, className, mode = "page" } = props;
  const { onClose } = useModal();
  const currentUserRole = useCurrentRole();
  // console.log(initialData);
  const [festivals, setFestivals] = useState<FestivalType[] | undefined>();
  const [executors, setExecutors] = useState<ExecutorType[] | undefined>();
  const [users, setUsers] = useState<UserType[] | undefined>();
  // const updateFestivalExecutors = useFestivalStore(
  //   (state) => state.updateFestivalExecutors
  // );

  const onOpen = useModal((state) => state.onOpen);

  // console.log(localPlays, localPlays?.length);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();

  //   const locale = params.locale;

  // const festivalId = params.festivalId as string;
  const userId = params.userId as string;
  const executorId = params.executorId as string;

  const form = useForm<LinkUserExecutorFormValues>({
    resolver: zodResolver(userExecutorLinkSchema),
    defaultValues: {
      ...initialData,
    },
  });

  const onSubmit = async (values: LinkUserExecutorFormValues) => {
    setIsLoading(true);

    startTransition(() => {
      createUserExecutorLinkRequest(values)
        // .then((response) => response.json())
        .then(async (data) => {
          toast.success(
            t("messages.created", {
              ns: "constants",
              instance: t("actions.linkTo", {
                ns: "common",
                instance: t("executor.single", { ns: "constants" }),
                to: t("user.single", { ns: "constants" }),
              }),
            })
          );

          // addExecutor(data);
          // updateUserExecutors(data);
          // updatePlayExecutors(data);
          // updateFestivalExecutors(data);

          router.refresh();

          if (mode === "page") {
            //   router.push(`/${locale}/admin/executors`);
          } else {
            onClose();
            form.reset();
          }
        })
        .catch((error:Error) => toast.error(error.message))
        .finally(() => setIsLoading(false));
    });
  };

  const submitBtn = t("link.default", { ns: "constants" });

  const submitingText = `${t("link.loading", { ns: "constants" })}...`;

  const isSubmitting = isPending || form.formState.isSubmitting || isLoading;
  const isDisabled = isUploadingFile || isSubmitting;

  useEffect(() => {
    const key = userId ? "executor" : "user";
    getRemainingUserExecutorLinkRequest(key)
      .then((response) => response.json())
      .then((responseData) => {
        userId && setExecutors(responseData);
        !userId && setUsers(responseData);
      })
      .catch((error) => console.error(error));
  }, [userId]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col w-full space-y-4", className)}
      >
        {!executorId && (
          <FormField
            control={form.control}
            name="executorId"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>
                  {t("forms.labels.executorName", { ns: "constants" })}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? `${
                              executors?.find((executor) => executor.id === field.value)
                                ?.name
                            } ${
                              executors?.find((executor) => executor.id === field.value)
                                ?.nickname
                                ? `(${
                                    executors?.find(
                                      (executor) => executor.id === field.value
                                    )?.nickname
                                  })`
                                : ""
                            }`
                          : t("actions.select", {
                              ns: "common",
                              instance: t("executor.single", {
                                ns: "constants",
                              }),
                            })}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput
                        placeholder={t("actions.select", {
                          ns: "common",
                          instance: t("executor.single", {
                            ns: "constants",
                          }),
                        })}
                      />
                      <CommandEmpty>
                        {t("errors.notFound", {
                          ns: "constants",
                          instance: t("executor.single", {
                            ns: "constants",
                          }),
                        })}
                      </CommandEmpty>
                      <CommandGroup>
                        {executors?.map((executor) => (
                          <CommandItem
                            value={executor.id}
                            key={executor.id}
                            onSelect={() => {
                              form.setValue("executorId", executor.id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                executor.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {executor.name}{" "}
                            {executor.nickname ? `(${executor.nickname})` : ""}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      {isAdmin(currentUserRole as UserRole) && (
                        <>
                          <Separator />
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                onOpen("createExecutor");
                              }}
                            >
                              <PlusCircle
                                className={cn(
                                  "ltr:mr-2 rtl:ml-2 h-4 w-4 text-emerald-600"
                                )}
                              />
                              {t("actions.create", {
                                ns: "common",
                                instance: t("executor.single", {
                                  ns: "constants",
                                }),
                              })}
                            </CommandItem>
                          </CommandGroup>
                        </>
                      )}
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!userId && (
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>
                  {t("forms.labels.userName", { ns: "constants" })}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? users?.find((user) => user.id === field.value)?.name
                          : t("actions.select", {
                              ns: "common",
                              instance: t("user.single", {
                                ns: "constants",
                              }),
                            })}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput
                        placeholder={t("actions.select", {
                          ns: "common",
                          instance: t("user.single", {
                            ns: "constants",
                          }),
                        })}
                      />
                      <CommandEmpty>
                        {t("notFound", {
                          ns: "constants",
                          instance: t("user.single", {
                            ns: "constants",
                          }),
                        })}
                      </CommandEmpty>
                      <CommandGroup>
                        {users?.map((user) => (
                          <CommandItem
                            value={user.id}
                            key={user.id}
                            onSelect={() => {
                              form.setValue("userId", user.id);
                              form.trigger("userId");
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                user.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <Separator />
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Separator />
        <div className="flex w-full justify-end items-center">
          <Button type="submit" disabled={isDisabled}>
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
  );
};

export default LinkUserExecutorForm;
