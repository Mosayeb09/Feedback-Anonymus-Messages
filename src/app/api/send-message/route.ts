import dbConnect from "@/lib/dbConnect"

import UserModel from "@/model/user"
import { Message } from "@/model/user"

export async function POST(request: Request) {

    await dbConnect();
    const {username, content}=await request.json();
    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            )
        }
        //is user accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages",
                },
                { status: 400 }
            )
        }
        const newMessage = {content, createdAt:new Date()} as Message
        user.messages.push(newMessage);
        await user.save();
        return Response.json(
            {
             success: true,
             message:"Message sent successfully"
            },
            {status:200}
        )
    } catch (error) {
        console.log('An unexpected error occurred',error);
        return Response.json(
            {
                success: false,
                message:"Error sending message"
            },
            {status:500}
        )
        
    }
}