import { auth } from "@/auth";
import { publicProcedure } from "./trpc";
import { Session } from "next-auth/types";
import { TRPCError } from "@trpc/server";

type Context = {
  // user is nullable
  session: Session;
};

export const protectedProcedure = publicProcedure.use(async (opts) => {
  const session = await auth();
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Auth required!",
    });
  }

  return opts.next({
    ctx: {
      session,
    },
  });
});
