"use client";

import { trpc } from "@/app/_trpc/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { NewProfileSchema } from "@/schemas";
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
import { useAvatar } from "@/hooks/useAvatar";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { toBase64Url } from "@/lib/base64";
import { compressImageAsync } from "@/lib/compress";
import { objectToFormData } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface ProfileFormProps {
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export const ProfileForm = ({ setDialogOpen }: ProfileFormProps) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const user = useCurrentUser();
  const avatar = useAvatar();
  const { update } = useSession();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof NewProfileSchema>>({
    resolver: zodResolver(NewProfileSchema),
    defaultValues: {
      name: user?.name || "My New Name",
      newPicture: 0,
    },
  });

  const mutation = trpc.user.newProfile.useMutation();

  const fileInput = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileUpload, setFileUpload] = useState<File | null>(null);

  const onPictureUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!fileInput.current || !fileInput.current.files) return;
    if (!fileInput.current.files.length) return;
    const file = fileInput.current.files[0];

    // compress file
    const compressedFile = await compressImageAsync(file, {
      width: 256,
      height: 256,
      quality: 0.6,
      resize: "cover",
    });
    setFileUpload(compressedFile);

    // make preview
    const base64Url = await toBase64Url(compressedFile);
    setPreview(base64Url);

    // change form data
    form.setValue("newPicture", 1);
  };

  const deleteCurrentPicture = () => {
    const params = new URLSearchParams();
    params.append("name", user?.name || "HCL");
    setPreview(`https://ui-avatars.com/api/?${params.toString()}`);
    form.setValue("newPicture", 2);
  };

  const [error, setError] = useState("");

  const onSubmit = async (values: z.infer<typeof NewProfileSchema>) => {
    if (!executeRecaptcha) return;

    const reCaptchaToken = await executeRecaptcha("user");

    const result = await mutation.mutateAsync({
      ...values,
      reCaptchaToken,
    });

    if (result.presignedPost && fileUpload) {
      const { postURL, formData } = result.presignedPost;
      const body = objectToFormData(formData);
      body.append("file", fileUpload);

      const res = await fetch(postURL, {
        method: "POST",
        body,
      });
      if (!res.ok) {
        setError("Failed to upload! ");
      }
    }

    toast({
      title: result.success,
    });

    update();
    closeDialog();
  };

  const closeDialog = () => setDialogOpen(false);

  const newPicture = form.watch("newPicture");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="pt-4 pb-0.5 space-y-4"
      >
        <input
          className="hidden"
          type="file"
          ref={fileInput}
          onChange={onPictureUpload}
          multiple={false}
        />
        <div className="flex gap-6">
          <img
            className="w-32 h-32 rounded-full"
            src={preview || avatar.url}
            alt=""
          />
          <div className="flex-grow space-y-2">
            {avatar.type === "Picture" && newPicture !== 2 && (
              <Button
                className="w-full font-mono"
                variant={"destructive"}
                onClick={deleteCurrentPicture}
                type="button"
              >
                {"Delete Current Picture"}
              </Button>
            )}
            <Button
              className="w-full font-mono"
              variant={"outline"}
              onClick={() => fileInput.current?.click()}
              type="button"
            >
              Upload From My Device
            </Button>
            <p className="text-sm text-muted-foreground">
              Allow any type of image. But File will be compressed
              automatically.
            </p>
          </div>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={mutation.isLoading}
                  placeholder="My New Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
