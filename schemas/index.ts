import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  twoFactorCode: z.string().optional(),
  reCaptchaToken: z.string(),
});

export const AuthJSCredentialSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const TRPCReCaptchaSchema = z.object({
  reCaptchaToken: z.string(),
});

export const RegisterSchema = z
  .object({
    email: z.string().email(),
    password: z.string().trim().min(6),
    confirmPassword: z.string(),
    name: z
      .string()
      .min(1, {
        message: "Name is required",
      })
      .max(50),
    reCaptchaToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const ResetSchema = z.object({
  email: z.string().email(),
  reCaptchaToken: z.string(),
});

export const NewPasswordSchema = z
  .object({
    password: z.string().trim().min(6),
    confirmPassword: z.string(),
    reCaptchaToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const NewProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, {
      message: "Name is required",
    })
    .max(50),
  newPicture: z.number(),
});

export const NewEmailSchema = z.object({
  email: z.string().email(),
});

export const ChangePasswordSchema = z.object({
  password: z.string().optional(),
});
