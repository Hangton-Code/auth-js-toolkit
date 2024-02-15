"use client";

import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas";
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
import { useSearchParams } from "next/navigation";
import { reset } from "@/actions/reset";

export const ResetForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof ResetSchema>) => {
      return reset(values);
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    const result = await mutation.mutateAsync(values);
  };

  return (
    <CardWrapper
      headerLabel="Forgot Password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={mutation.isLoading}
                      placeholder="hangton@hangton.me"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {!mutation.data?.success && (
            <FormError message={urlError || mutation.data?.error} />
          )}
          <FormSuccess message={mutation.data?.success} />
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isLoading}
          >
            Send Reset Email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
