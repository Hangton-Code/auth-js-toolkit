import { getUserById } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ChangePasswordSchema } from "@/schemas";
import { protectedProcedure } from "@/server/middlewares";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

export const changePasswordProcedure = protectedProcedure
  .input(ChangePasswordSchema)
  .mutation(async (opts) => {
    const { user } = opts.ctx.session;
    const { password } = opts.input;

    if (!user.email) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Server Error!`,
      });
    }

    if (!user.isPasswordEnabled) {
      const passwordResetToken = await generatePasswordResetToken(user.id);
      await sendPasswordResetEmail(user.email, passwordResetToken.token);

      return { success: "Set password email sent!" };
    }

    if (!password) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Field "password" does not exist!`,
      });
    }

    const existingUser = await getUserById(user.id);
    if (!existingUser || !existingUser.password) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `User does not exist; or password authenication is not enabled!`,
      });
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!passwordsMatch) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Field "password" is not valid.`,
      });
    }

    const passwordResetToken = await generatePasswordResetToken(
      existingUser.id
    );
    await sendPasswordResetEmail(user.email, passwordResetToken.token);

    return { success: "Reset email sent!" };
  });
