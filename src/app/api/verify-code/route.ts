import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/user";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username,verifyCode}= await request.json();

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
        const isCodeValid = user.verifyCode === verifyCode;
        const isCodeNotExpired = user.verifyCodeExpiry
      ? new Date(user.verifyCodeExpiry) > new Date()
      : false;

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully",
                },
                { status: 200 }
            )
        }
        else if(!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired,Please request a new one",
                },
                { status: 400 }
            )
        }
        else{
            return Response.json(
                {
                    success: false,
                    message: "Invalid verification code",
                },
                { status: 400 }
            )
        }
        
           
        
        
    } catch (error) {
        console.error("Error verifying user", error);
        return Response.json(
            {
                success: false,
                message: "Error verifying user",
            },
            { status: 500 }
        )
        
    }
}