"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export const AccountProviderSection = () => {
  const user = useCurrentUser();

  if (!user?.accountProvider) return <></>;

  return (
    <div className="flex items-center justify-between rounded h-16 max-sm:px-5 pl-9 pr-8">
      <div>
        <p className="font-medium">3rd-Party Account Provider</p>
        <p className="text-sm text-muted-foreground">
          Cannot change/link again due to safety issues.
        </p>
      </div>
      <p className="font-mono text-sm text-muted-foreground">
        {user.accountProvider}
      </p>
    </div>
  );
};
