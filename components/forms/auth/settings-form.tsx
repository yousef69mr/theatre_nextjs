"use client";

import { useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema } from "@/lib/validations/auth";
// import { settings } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import FormSuccess from "../form-success";
import FormError from "../form-error";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { ExtendedUser } from "@/next-auth";
import { Switch } from "@/components/ui/switch";
import { settingsRequest } from "@/lib/api-calls/auth/settings";

interface Props {
  initialData: ExtendedUser | undefined;
}

const SettingsForm = (props: Props) => {
  const { initialData: user } = props;

  const [isPending, startTransition] = useTransition();

  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<Zod.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = (values: Zod.infer<typeof settingsSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      //api call
      settingsRequest(values)
        .then((response) => response.data)
        .then((data) => {
          if (data?.error) {
            // form.reset();
            setError(data?.error);
          }

          if (data?.success) {
            // form.reset();
            setSuccess(data?.success);
          }
        })
        .catch(() => setError("Something went wrong!"));

      //server action
      // settings(values)
      //   .then((data) => {
      //     if (data?.error) {
      //       // form.reset();
      //       setError(data?.error);
      //     }

      //     if (data?.success) {
      //       // form.reset();
      //       setSuccess(data?.success);
      //     }
      //   })
      //   .catch(() => setError("Something went wrong!"));
    });
  };

  const isSubmitting = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123456"
                    disabled={isSubmitting || isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!user?.isOAuth && (
            <>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        disabled={isSubmitting || isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        disabled={isSubmitting || isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        disabled={isSubmitting || isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormField
            name="role"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting || isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.USER}>User</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {!user?.isOAuth && (
            <FormField
              name="isTwoFactorEnabled"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable Two-factor authentication for this user to add an
                      extra layer of security when logging
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting || isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          disabled={isSubmitting || isPending}
          type="submit"
          className="w-full"
        >
          Save Changes
        </Button>
      </form>
    </Form>
  );
};

export default SettingsForm;
