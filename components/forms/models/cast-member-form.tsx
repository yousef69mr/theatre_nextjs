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
import { CastMemberType } from "@/types";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

// import { SingleImageUpload } from "@/components/helpers/single-image-upload";
import { Loader2 } from "lucide-react";

import toast from "react-hot-toast";

import { Separator } from "@/components/ui/separator";

import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/stores/use-modal-store";
// import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";

import { useActorStore } from "@/hooks/stores/use-actor-store";
import { castMemberSchema } from "@/lib/validations/models/cast-member";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCastMemberRequest,
  updateCastMemberRequest,
} from "@/lib/api-calls/models/cast-member";
// import { UserRole } from "@prisma/client";
import { actorRoles } from "@/lib/auth";
import { convertDateFormat } from "@/lib/helpers/time-parser";

interface CastMemberFormProps extends HtmlHTMLAttributes<HTMLElement> {
  initialData: CastMemberType | null;
  mode?: "modal" | "page";
}

type CastMemberFormValues = Zod.infer<typeof castMemberSchema>;
// const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const CastMemberForm: FC<CastMemberFormProps> = (props) => {
  const { initialData, className, mode = "page" } = props;
  const { onClose } = useModal();
  const updateActorCastMembers = useActorStore(
    (state) => state.updateActorCastMembers
  );
  const localActors = useActorStore((state) => state.actors);
  console.log(initialData, Boolean(initialData));

  const [isPending, startTransition] = useTransition();
  const [availableRoles, setAvailableRoles] = useState<typeof actorRoles>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const router = useRouter();
  const params = useParams();
  // const pathname = usePathname();

  const { t } = useTranslation();

  // const locale = params.locale;
  const actorId = params.actorId as string;

  const form = useForm<CastMemberFormValues>({
    resolver: zodResolver(castMemberSchema),
    defaultValues: {
      ...initialData,
      startDate:
        (initialData?.startDate && convertDateFormat(initialData.startDate)) ||
        undefined,
      endDate:
        (initialData?.endDate && convertDateFormat(initialData.endDate)) ||
        undefined,
      actorId: actorId || initialData?.actor.id,
    },
  });

  const onSubmit = async (values: CastMemberFormValues) => {
    setIsLoading(true);

    startTransition(() => {
      if (initialData) {
        // setIsEditing(true);
        updateCastMemberRequest(values, initialData.id)
          // .then((response) => response.json())
          .then(async (data) => {
            // console.log("api success");
            toast.success(
              t("messages.updated", {
                ns: "constants",
                instance: t("role.single", { ns: "constants" }),
              })
            );

            updateActorCastMembers(data);
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
          });
      } else {
        createCastMemberRequest(values)
          // .then((response) => response.json())
          .then(async (data) => {
            toast.success(
              t("messages.added", {
                ns: "constants",
                instance: t("role.single", { ns: "constants" }),
              })
            );

            updateActorCastMembers(data);
            router.refresh();

            if (mode === "page") {
              // router.push(`/${locale}/admin/actors`);
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
  // const isValid = form.formState.isValid;

  const handleRoleOptions = () => {
    // console.log();
    const selectedActor = localActors?.find((actor) => actor.id === actorId);
    // console.log(selectedActor);
    if (!selectedActor) return;

    const takenCastMemberRoles: string[] = selectedActor.castMembers?.map(
      (castMember) => castMember.role
    );
    // console.log();
    if (takenCastMemberRoles) {
      const remainingRoleOptions: typeof actorRoles = actorRoles.filter(
        (role) => !takenCastMemberRoles.includes(role)
      );
      setAvailableRoles(remainingRoleOptions);
    } else {
      setAvailableRoles(takenCastMemberRoles);
    }
  };
  useEffect(() => {
    handleRoleOptions();
  }, [localActors]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col w-full space-y-4", className)}
      >
        <div
          className={cn(
            "flex w-full flex-wrap gap-6",
            mode === "modal" && "flex-col items-center"
          )}
        >
          {!initialData && (
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("forms.labels.role", {
                      ns: "constants",
                    })}
                  </FormLabel>
                  <Select
                    disabled={isDisabled}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("forms.placeholder.role", {
                            ns: "constants",
                          })}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem
                          key={role}
                          value={role}
                          className="capitalize"
                        >
                          {t(`UserRole.${role}`, { ns: "common" })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="flex w-full flex-wrap gap-x-2 items-center">
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
        </div>

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

export default CastMemberForm;
