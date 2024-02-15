"use client";

import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./card-wrapper";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>();

  const mutation = useMutation({
    mutationFn: (token: string) => {
      return newVerification(token);
    },
  });

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Missing Token!");
      return;
    }

    const result = await z.string().uuid().safeParseAsync(token);
    if (!result.success) {
      setError("Invalid Token!");
      return;
    }

    await mutation.mutateAsync(token);
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!error && !mutation?.data?.error && !mutation?.data?.success && (
          <BeatLoader />
        )}
        <FormSuccess message={mutation?.data?.success} />
        <FormError message={error || mutation.data?.error} />
      </div>
    </CardWrapper>
  );
};
