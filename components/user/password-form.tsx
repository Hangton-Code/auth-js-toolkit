"use client";

import { trpc } from "@/app/_trpc/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ChangePasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormError } from "../form-error";
import { useToast } from "@/components/ui/use-toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface ChangePasswordFormProps {
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export const ChangePasswordForm = ({
  setDialogOpen,
}: ChangePasswordFormProps) => {
  const { toast } = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const mutation = trpc.user.changePassword.useMutation();

  const [error, setError] = useState("");

  const onSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
    if (!values.password) {
      setError("Current password is required!");
      return;
    }

    setError("");

    if (!executeRecaptcha) return;

    const reCaptchaToken = await executeRecaptcha("user");

    const result = await mutation.mutateAsync({
      ...values,
      reCaptchaToken,
    });

    toast({
      title: result.success,
    });

    closeDialog();
  };

  const closeDialog = () => setDialogOpen(false);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="pt-4 pb-0.5 space-y-4"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input
                  disabled={mutation.isLoading}
                  placeholder="********"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={error || mutation.error?.message} />
        <div className="flex justify-end gap-3">
          <Button onClick={closeDialog} variant={"ghost"}>
            Discard
          </Button>
          <Button type="submit" disabled={mutation.isLoading}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
