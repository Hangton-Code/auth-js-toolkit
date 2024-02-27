"use client";

import "./recaptcha.css";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export const ReCaptchaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};
