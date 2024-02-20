import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { NewEmailSchema } from "@/schemas";
import { protectedProcedure } from "@/server/middlewares";
import { TRPCError } from "@trpc/server";

export const newEmailProcedure = protectedProcedure
  .input(NewEmailSchema)
  .mutation(async (opts) => {
    const { email } = opts.input;
    const { user } = opts.ctx.session;

    if (!user.id) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Server Error!`,
      });
    }

    if (user.email === email) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email address is the same as the old one!",
      });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email address is already in use!",
      });
    }

    const verificationToken = await generateVerificationToken(user.id, email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation Email Sent!" };
  });
