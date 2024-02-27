"use client";

import { trpc } from "@/app/_trpc/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { NewEmailSchema } from "@/schemas";
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
import { Dispatch, SetStateAction, useEffect } from "react";
import { FormError } from "../form-error";
import { useToast } from "@/components/ui/use-toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface EmailFormProps {
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export const EmailForm = ({ setDialogOpen }: EmailFormProps) => {
  const user = useCurrentUser();
  const { toast } = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm<z.infer<typeof NewEmailSchema>>({
    resolver: zodResolver(NewEmailSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  const mutation = trpc.user.newEmail.useMutation();

  const onSubmit = async (values: z.infer<typeof NewEmailSchema>) => {
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Email</FormLabel>
              <FormControl>
                <Input
                  disabled={mutation.isLoading}
                  placeholder="hcl@hangton.me"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={mutation.error?.message} />
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
