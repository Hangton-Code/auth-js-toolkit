import { auth } from "@/auth";
import { publicProcedure } from "./trpc";
import { Session } from "next-auth";
import { TRPCError } from "@trpc/server";
import { TRPCReCaptchaSchema } from "@/schemas";
import { verifyRecaptcha } from "@/lib/recaptcha";

type Context = {
  session: Session;
};

export const reCaptchaProcedure = publicProcedure
  .input(TRPCReCaptchaSchema)
  .use(async (opts) => {
    const { success } = await verifyRecaptcha(opts.input.reCaptchaToken);
    if (!success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "reCaptcha failed!",
      });
    }

    return opts.next();
  });

export const protectedProcedure = reCaptchaProcedure.use(async (opts) => {
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
