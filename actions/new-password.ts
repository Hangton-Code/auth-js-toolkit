"use server";

import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { getPasswordResetTokenByToken } from "@/data/password-token";
import { z } from "zod";
import { NewPasswordSchema } from "@/schemas";
import bcrypt from "bcryptjs";

export const newPassword = async (
  token: string,
  values: z.infer<typeof NewPasswordSchema>
) => {
  // validate the passwords
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  // validate the token
  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist; or the token is no longer valid!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserById(existingToken.userId);

  if (!existingUser) {
    return { error: "User does not exist!" };
  }

  // hash password and update
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  // remove the token used
  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password reset!" };
};
