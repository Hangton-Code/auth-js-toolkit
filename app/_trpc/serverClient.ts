import { httpBatchLink } from "@trpc/client";

import { appRouter } from "@/server/routers";

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_APP_URL as string}/api/trpc`,
    }),
  ],
});
