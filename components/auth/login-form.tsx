"use client";

import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
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
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export const LoginForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      reCaptchaToken: "",
    },
  });

  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof LoginSchema>) => {
      return login(values);
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    if (!executeRecaptcha) return;

    const reCaptchaToken = await executeRecaptcha("login");

    const result = await mutation.mutateAsync({
      ...values,
      reCaptchaToken,
    });

    if (!result?.twoFactor) {
      form.reset();
      setShowTwoFactor(false);
      return;
    }

    setShowTwoFactor(true);
  };

  const twoFactorCode = form.watch("twoFactorCode");

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="twoFactorCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Two Factor Code</FormLabel>
                      <FormControl>
                        <Input
                          disabled={mutation.isLoading}
                          placeholder="XXXXXX"
                          maxLength={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {!showTwoFactor && (
              <>
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
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <Button variant={"link"} asChild className="px-0">
                        <Link href="/auth/reset">Forgot Password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          {!mutation.data?.success && (
            <FormError message={urlError || mutation.data?.error} />
          )}
          <FormSuccess message={mutation.data?.success} />
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isLoading}
            variant={showTwoFactor && !twoFactorCode ? "outline" : "default"}
          >
            {!showTwoFactor && "Login"}
            {showTwoFactor && !twoFactorCode && "Send The Code Again"}
            {showTwoFactor && twoFactorCode && "Confirm"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
