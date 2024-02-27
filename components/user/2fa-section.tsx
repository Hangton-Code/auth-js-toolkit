"use client";

import { trpc } from "@/app/_trpc/client";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export const TwoFactorSection = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const user = useCurrentUser();
  const { update } = useSession();
  const mutation = trpc.user.toggleTwoFactor.useMutation();

  const onChange = async () => {
    if (!executeRecaptcha) return;

    const reCaptchaToken = await executeRecaptcha("user");

    const result = await mutation.mutateAsync({
      reCaptchaToken,
    });

    toast({
      title: result.success,
    });
    update();
  };

  useEffect(() => {
    if (mutation.error?.message) {
      toast({
        variant: "destructive",
        title: mutation.error.message,
      });
    }
  }, [mutation.error]);

  return (
    <div className="flex items-center justify-between rounded h-16 max-sm:px-5 pl-9 pr-8">
      <div>
        <p className="font-medium">2FA(Two Factor) Authenication</p>
        <p className="text-sm text-muted-foreground">
          Send 2FA Code to email before login
        </p>
      </div>
      <Switch
        checked={user?.isTwoFactorEnabled}
        onCheckedChange={onChange}
        disabled={mutation.isLoading}
      />
    </div>
  );
};
