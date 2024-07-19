import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect;

  const session = await getServerSession(AuthOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Successfully updated message acceptance status",
        updatedUser,
      },
      { status: 401 }
    );
  } catch (error) {
    console.log("failed to update user status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect;
  const session = await getServerSession(AuthOptions);
  const _user: User = session?.user as User;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id);
  const user = await UserModel.aggregate([
    // returns an array of users
    {
      $match: { _id: userId },
    },
    { $unwind: "$messages" },
    { $sort: { "messages.createdAt": -1 } },
    { $group: { _id: "$_id", messages: { $push: "$messages" } } },
  ]);

  if (!user || user.length === 0) {
    return Response.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }
  return Response.json(
    { success: true, messages: user[0].messages },
    { status: 200 }
  );
}
// const foundUser = await UserModel.findById(userId);

// try {
//   if (!foundUser) {
//     return Response.json(
//       { success: false, message: "User not found" },
//       { status: 404 }
//     );
//   }
//   return Response.json(
//     { success: true, isAcceptingMessages: foundUser.isAcceptingMessages },
//     { status: 200 }
//   );
// } catch (error) {
//   console.log("failed to get user status to accept messages", error);
//   return Response.json(
//     {
//       success: false,
//       message: "failed to get user status to accept messages",
//     },
//     { status: 500 }
//   );
// }
// }
