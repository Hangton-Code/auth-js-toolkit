"use server";

import { RegisterSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { generateRegisterToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { verifyRecaptcha } from "@/lib/recaptcha";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, reCaptchaToken } = validatedFields.data;

  // verify reCaptcha
  const { success } = await verifyRecaptcha(reCaptchaToken);
  if (!success) {
    return { error: "reCaptcha failed!" };
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = await generateRegisterToken(
    email,
    name,
    hashedPassword
  );
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation Email Sent!" };
};
