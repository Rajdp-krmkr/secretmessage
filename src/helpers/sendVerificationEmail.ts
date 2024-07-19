import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/verificationEmail";
import { APIresponse } from "@/types/APIresponse";
import { Verification } from "next/dist/lib/metadata/types/metadata-types";

export async function sendVerificationEmail(
  email: string,
  verifyCode: string,
  username: string
): Promise<APIresponse> {
  try {
    const from_email = "onboarding@resend.dev";
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Email",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    console.log("Verification email sent successfully!");
    console.log("from:",from_email,", to:", email);
    
    return { success: true, message: "Verification email sent successfully!" };
  } catch (error) {
    console.log("Error sending verification email: ", error);
    return { success: false, message: "Error sending verification email!" };
  }
}
