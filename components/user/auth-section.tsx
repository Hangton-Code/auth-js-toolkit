import { SectionWrapper } from "./section-wrapper";
import { PasswordSection } from "./password-section";
import { AccountProviderSection } from "./account-section";
import { TwoFactorSection } from "./2fa-section";

export const AuthSection = () => {
  return (
    <SectionWrapper title="Authenication">
      <div className="">
        <PasswordSection />
        <AccountProviderSection />
        <TwoFactorSection />
      </div>
    </SectionWrapper>
  );
};
