import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { date, z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

export async function POST(request: Request) {
  await dbConnect;
  const { username, code } = await request.json();
  const decodedUsername = decodeURIComponent(username);
  const user = await UserModel.findOne({ username: decodedUsername });

  if (!user) {
    console.log("Username not found");
    return Response.json(
      {
        success: false,
        message: "Username not found",
      },
      { status: 404 }
    );
  }
  const isCodeValid = user.verifyCode === code;
  const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
  if (isCodeValid && isCodeNotExpired) {
    user.isVerified = true;
    await user.save();
    console.log("Account verified successfully");
    return Response.json(
      {
        success: true,
        message: "Account verified successfully",
      },
      { status: 200 }
    );
  } else if (!isCodeValid) {
    console.log("verification code is not matched");
    return Response.json(
      {
        success: true,
        message: "verification code is not matched",
      },
      { status: 400 }
    );
  } else if (!isCodeNotExpired) {
    console.log("verification code has expired , please sign-up again");
    return Response.json(
      {
        success: true,
        message: "verification code has expired , please sign-up again",
      },
      { status: 400 }
    );
  }

  // my try
  //   const verifiedUser = await UserModel.findOne({verifyCode : code});
  //   if (!verifiedUser) {
  //     console.log("verification code is not matched");
  //     return Response.json(
  //       {
  //         success: false,
  //         message: "verification code is not matched",
  //       },
  //       { status: 500 }
  //     );

  return Response.json(
    {
      success: true,
      message: "User is successfully verified",
    },
    { status: 500 }
  );
}
