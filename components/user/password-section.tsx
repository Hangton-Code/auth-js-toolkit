"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChangePasswordForm } from "./password-form";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export const PasswordSection = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const user = useCurrentUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const mutation = trpc.user.changePassword.useMutation();

  useEffect(() => {
    if (mutation.error?.message) {
      toast({
        variant: "destructive",
        title: mutation.error.message,
      });
    }
  }, [mutation.error]);

  const setAPassword = async () => {
    if (!executeRecaptcha) return;

    const reCaptchaToken = await executeRecaptcha("user");

    const result = await mutation.mutateAsync({ reCaptchaToken });

    toast({ title: result.success });
  };

  return (
    <div className="flex items-center justify-between rounded h-16 max-sm:px-5 pl-9 pr-8">
      <div>
        <p className="font-medium">Password</p>
        <p className="text-sm text-muted-foreground">
          Password authenication{" "}
          {user?.isPasswordEnabled && (
            <span className="text-emerald-500 font-medium">is enabled</span>
          )}
          {!user?.isPasswordEnabled && (
            <span className="text-destructive font-medium">has not set</span>
          )}
        </p>
      </div>
      {!user?.isPasswordEnabled && (
        <Button
          onClick={setAPassword}
          variant={"outline"}
          size="sm"
          className="font-mono"
          disabled={mutation.isLoading}
        >
          Set a Password
        </Button>
      )}
      {user?.isPasswordEnabled && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant={"outline"}
              size="sm"
              className="font-mono"
              disabled={mutation.isLoading}
            >
              Change Password
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <ChangePasswordForm setDialogOpen={setOpen} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
