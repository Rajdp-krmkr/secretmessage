import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect;
  // e.g: localhost:3000/api/cuu?username=rajdeep?ph=2910299122
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get("username") };
    //validate with zod:
    const result = UserNameQuerySchema.safeParse(queryParam);

    console.log(searchParams);
    console.log(queryParam);
    console.log(result);

    if (!result.success) {
      console.log("result.error.format() : ", result.error.format());
      console.log(
        "result.error.format().username?._errors : ",
        result.error.format().username?._errors
      );
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: usernameErrors
            ? usernameErrors.join(", ")
            : "Invalid querry parameter.",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        { success: false, message: "Username is already exist, please choose another username" },
        { status: 400 }
      );
    }
    return Response.json(
      { success: true, message: "Username is unique" },
      { status: 400 }
    );
  } catch (error) {
    console.log("Error checking username", error);
    return Response.json(
      { success: false, meessage: "Error checking username" },
      { status: 500 }
    );
  }
}
