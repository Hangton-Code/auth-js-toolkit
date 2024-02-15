import { db } from "@/lib/db";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByUserId = async (userId: string) => {
  try {
    const passwordToken = await db.passwordResetToken.findFirst({
      where: { userId },
    });

    return passwordToken;
  } catch {
    return null;
  }
};
