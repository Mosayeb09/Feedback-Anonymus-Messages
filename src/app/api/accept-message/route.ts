import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {User} from "next-auth";


export async function POST(request: Request) {


    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user ;

    if (!session || !session.user) {

        return Response.json(
            {
                success: false,
                message:"Not authenticated"

            },
            { status: 401 }
        )

    }
    const userId = user._id;
    const {acceptMessage} = await request.json();

    try {
       const updatedUser = await UserModel.findByIdAndUpdate(userId,
             
           {isAcceptingMessage:acceptMessage},
            { new: true } 
         
    )
    if(!updatedUser){
        return Response.json(
            {
                success: false,
                message:"failed to update user status to accept messages"

            },
            { status: 500 }
        )
    }

        return Response.json(
            {
                success: true,
                message:"updated user status to accept accept messages",
                updatedUser,
            },
            { status: 200 }
        )
        
    } catch (error) {
        console.log("failed to update user status to  accept messages",error)
        return Response.json(
            
            {
                success: false,
                message:"failed to update user status to accept accept messages"

            },
            { status: 500 }
        )
        
    }

}
export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user ;

    if (!session || !user) {

        return Response.json(
            {
                success: false,
                message:"Not authenticated"

            },
            { status: 401 }
        )

    }
    // const userId = user._id;

   try {
    const foundUser = await UserModel.findById(user._id);
    if (!foundUser) {
     return Response.json(
         {
             success: false,
             message:"User not found"
 
         },
         { status: 404 }
     )
  }
 
     return Response.json(
         {
             success: true,
             isAcceptingMessage:foundUser.isAcceptingMessage,
             
         },
         { status: 200 }
     )
   } catch (error) {
    console.log("Failed to get user message acceptance status:",error)
        return Response.json(
            
            {
                success: false,
                message:"Error is getting message acceptance status"

            },
            { status: 500 }
        )
    
   }
}



