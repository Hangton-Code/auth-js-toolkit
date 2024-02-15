"use client";

import { useAvatar } from "@/hooks/useAvatar";
import { SectionWrapper } from "./section-wrapper";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Pencil2Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProfileForm } from "./profile-form";
import { useState } from "react";

export const ProfileSection = () => {
  const avatar = useAvatar();
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);

  return (
    <SectionWrapper title="Profile">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="group flex items-center justify-between hover:bg-muted rounded h-20 max-sm:px-4 px-8 cursor-pointer">
            <div className="flex items-center gap-4">
              <img src={avatar.url} className="w-14 h-14 rounded-full" alt="" />
              <p className="font-medium">{user?.name}</p>
            </div>
            <Pencil2Icon className="hidden group-hover:block text-muted-foreground hover:text-foreground" />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Profile</DialogTitle>
            <ProfileForm setDialogOpen={setOpen} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  );
};
