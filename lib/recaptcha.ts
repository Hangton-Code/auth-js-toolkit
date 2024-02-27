import axios from "axios";

type ReCaptchaSiteVerifyResponse = {
  success: boolean;
};

export const verifyRecaptcha = async (token: string) => {
  try {
    const formData = new FormData();
    formData.append("secret", process.env.RECAPTCHA_SECRET_KEY as string);
    formData.append("response", token);

    const res = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      formData
    );

    const { success } = res.data as ReCaptchaSiteVerifyResponse;

    return { success };
  } catch {
    return { success: false };
  }
};
