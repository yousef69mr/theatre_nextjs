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
import { UserType } from "@/types";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

// import { SingleImageUpload } from "@/components/helpers/single-image-upload";
import { Loader2, Pencil } from "lucide-react";

import toast from "react-hot-toast";

import { Separator } from "@/components/ui/separator";

import { useTranslation } from "react-i18next";

import { userSchema } from "@/lib/validations/models/user";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/stores/use-modal-store";
// import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import FileUpload from "@/components/helpers/file-upload";
// import {
//   createUserRequest,
//   updateUserRequest,
// } from "@/lib/api-calls/models/user";

import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FacultyCast } from "@prisma/client";
import {
  createUserRequest,
  updateUserRequest,
} from "@/lib/api-calls/models/auth/user";
import { userRoles } from "@/lib/auth";

interface UserFormProps extends HtmlHTMLAttributes<HTMLElement> {
  initialData: UserType | null;
}

type UserFormValues = Zod.infer<typeof userSchema>;
// const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const UserRoleForm: FC<UserFormProps> = (props) => {
  const { initialData, className } = props;
  const { onClose } = useModal();
  // const addUser = useUserStore((state) => state.addUser);
  // const updateUser = useUserStore((state) => state.updateUser);
  // console.log(initialData, Boolean(initialData));
  // const [isEditing, setIsEditing] = useState<boolean>(!Boolean(initialData));

  // const toggleEdit = () => setIsEditing((current) => !current);

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const router = useRouter();
  const params = useParams();
  // const pathname = usePathname();

  const { t } = useTranslation();

  const locale = params.locale;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      ...initialData,
      password: undefined,
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    setIsLoading(true);

    startTransition(() => {
      if (initialData) {
        // setIsEditing(true);
        updateUserRequest(values, initialData.id)
          .then((response) => response.json())
          .then(async (data) => {
            // console.log("api success");
            toast.success(
              t("messages.updated", {
                ns: "constants",
                instance: t("user.single", { ns: "constants" }),
              })
            );

            // updateUser(data);
            router.refresh();

            onClose();
            form.reset();
          })
          .catch((error) => toast.error("something went wrong"))
          .finally(() => {
            setIsLoading(false);
            // setIsEditing(false);
          });
      } else {
        createUserRequest(values)
          .then((response) => response.json())
          .then(async (data) => {
            toast.success(
              t("messages.created", {
                ns: "constants",
                instance: t("user.single", { ns: "constants" }),
              })
            );

            // addUser(data);
            router.refresh();

            onClose();
            form.reset();
          })
          .catch((error) => toast.error("something went wrong"))
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col w-full space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                {t("forms.labels.role", { ns: "constants" })}
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
                        instance: t("forms.labels.role", {
                          ns: "constants",
                        }),
                      })}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {t(`UserRole.${role}`, { ns: "common" })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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

export default UserRoleForm;
