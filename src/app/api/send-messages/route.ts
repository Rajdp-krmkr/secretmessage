import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";
import { date } from "zod";

export async function POST(request: Request) {
  await dbConnect;

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne(username);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }
    if (!user.isAcceptingMessages) {
      return Response.json(
        { success: false, message: "User is not accepting messages" },
        { status: 403 }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message); //typescript issue , so using assertion
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
        newMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("An unexpected error occurred while sending message", error);
    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred while sending message",
      },
      { status: 500 }
    );
  }
}
