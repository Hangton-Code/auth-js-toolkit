"use client";

import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useMutation } from "@tanstack/react-query";
import { newPassword } from "@/actions/new-password";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const { update } = useSession();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const mutation = useMutation({
    mutationFn: ({
      token,
      values,
    }: {
      token: string;
      values: z.infer<typeof NewPasswordSchema>;
    }) => {
      return newPassword(token, values);
    },
  });

  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    if (!token) {
      setError("Missing Token!");
      return;
    }

    const result = await mutation.mutateAsync({ token, values });
  };

  useEffect(() => {
    if (mutation.data?.success) {
      update();
    }
  }, [mutation.data, update]);

  return (
    <CardWrapper
      headerLabel="Reset Password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={mutation.isLoading}
                      type="password"
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Your Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={mutation.isLoading}
                      type="password"
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error || mutation.data?.error} />
          <FormSuccess message={mutation.data?.success} />
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isLoading}
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
