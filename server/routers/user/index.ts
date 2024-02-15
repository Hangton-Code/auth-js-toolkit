import { router } from "@/server/trpc";
import { newProfileProcedure } from "./new-profile";
import { newEmailProcedure } from "./new-email";
import { changePasswordProcedure } from "./change-password";
import { toggleTwoFactorProcedure } from "./toggle-2fa";

export const userRouter = router({
  newProfile: newProfileProcedure,
  newEmail: newEmailProcedure,
  changePassword: changePasswordProcedure,
  toggleTwoFactor: toggleTwoFactorProcedure,
});
