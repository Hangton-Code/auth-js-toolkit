import { db } from "@/lib/db";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByUserId = async (userId: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { userId },
    });

    return verificationToken;
  } catch {
    return null;
  }
};
