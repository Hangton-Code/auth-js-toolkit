import { db } from "@/lib/db";
import { protectedProcedure } from "@/server/middlewares";

export const toggleTwoFactorProcedure = protectedProcedure.mutation(
  async (opts) => {
    const session = opts.ctx.session;

    await db.user.update({
      where: { id: session.user.id },
      data: {
        isTwoFactorEnabled: !session.user.isTwoFactorEnabled,
      },
    });

    return {
      success: `Two Factor Authenication is now ${
        !session.user.isTwoFactorEnabled ? "enabled" : "disabled"
      }`,
    };
  }
);
