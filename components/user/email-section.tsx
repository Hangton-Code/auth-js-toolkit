"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SectionWrapper } from "./section-wrapper";
import { EmailForm } from "./email-form";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Pencil2Icon } from "@radix-ui/react-icons";

export const EmailSection = () => {
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);

  return (
    <SectionWrapper title="Email Address">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="group flex items-center justify-between hover:bg-muted rounded h-16 max-sm:px-5 pl-9 pr-8 cursor-pointer">
            <p className="font-medium">{user?.email}</p>
            <Pencil2Icon className="hidden group-hover:block text-muted-foreground hover:text-foreground" />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
            <EmailForm setDialogOpen={setOpen} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  );
};
