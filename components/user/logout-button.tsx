"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  className?: string;
}

export const LogoutButton = ({ className }: LogoutButtonProps) => {
  return (
    <Button
      variant={"destructive"}
      className={className || ""}
      onClick={() => signOut()}
    >
      Signout
    </Button>
  );
};
