import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {User} from "next-auth";
import mongoose from "mongoose";


export async function GET() {

    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user:User = session?.user ;
    if (!session || !_user) {
        return Response.json(
            {
                success: false,
                message:"Not authenticated"
            },
            { status: 401 }
        )
    }
    const userId = new mongoose.Types.ObjectId(_user._id);
    try {
        //aggregate to get all messages from user
        const user = await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:"$messages"},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}},

        ]).exec();
        if(!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message:"No messages found"
                },
                { status: 404 }
            )
        }
            return Response.json(
                {
                    success: true,
                    messages:user[0].messages
                    
                },
                { status: 200 }
            )

        
    } catch (error) {
        console.error("Error fetching messages:", error);
        return Response.json(
            {
                success: false,
                message:"Error fetching messages"
            },
            { status: 500 }
        )
        
    } ;

}




