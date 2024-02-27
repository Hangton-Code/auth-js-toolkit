"use server";

import { db } from "@/lib/db";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist; or the token is no longer valid!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  // delete token
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  // for register
  if (!existingToken.userId) {
    await db.user.create({
      data: {
        name: existingToken.name,
        email: existingToken.email,
        password: existingToken.hashedPassword,
        emailVerified: new Date(),
      },
    });

    return { success: "Email verified!" };
  }

  // for new email verification
  await db.user.update({
    where: { id: existingToken.userId },
    data: { emailVerified: new Date(), email: existingToken.email },
  });

  return { success: "Email verified!" };
};
