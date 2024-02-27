"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import { z } from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, reCaptchaToken } = validatedFields.data;

  // verify reCaptcha
  const { success } = await verifyRecaptcha(reCaptchaToken);
  if (!success) {
    return { error: "reCaptcha failed!" };
  }

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    return { error: "User not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(existingUser.id);
  await sendPasswordResetEmail(existingUser.email, passwordResetToken.token);

  return { success: "Reset email sent!" };
};
