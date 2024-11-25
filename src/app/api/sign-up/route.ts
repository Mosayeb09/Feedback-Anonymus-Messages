import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
// import UserModel from './../../../model/user';

const verifyCode = Math.floor(100000+Math.random() * 900000).toString();
export async function POST(request: Request) {
    await dbConnect();
    try {
       const {username,email,password} = await request.json();
      const existingUserVarifiedByUsername = await UserModel.findOne({
        username,
        isVerifyed:true
       })
       if(existingUserVarifiedByUsername)
       {
        return Response.json(
            {success:false,
            message:"User already exists"
            },

            {status:400}
        )
       }
      const existingUserByEmail = await UserModel.findOne({
        email,
      })
      if(existingUserByEmail)
      {
        //if email exsit but not varified
        
        if(existingUserByEmail.isVerifyed)
        {
          return Response.json(
            {success:false,
            message:"User already exists with this email"
            },

            {status:400}
        )
        }
        else{
          const hashedPassword = await bcrypt.hash(password, 10);
          existingUserByEmail.password = hashedPassword;existingUserByEmail.verifyCode = verifyCode;existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
          existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
          await existingUserByEmail.save();

        }
      }
      else{
        const hashedPassword = await bcrypt.hash(password, 10);
        const  newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: new Date(Date.now() + 3600000),
            isVerifyed: false,
            isAcceptingMessage: true,
            messages: [],
          });
          await newUser.save();
          
      }
      //send verification email
      const emailResponse = await sendVerificationEmail(email,username,verifyCode)
      if(!emailResponse.success)
      {
        return Response.json(
            {success:false,
            message:"Error sending verification email"
            },

            {status:500}
        )
      }
      return Response.json(
        {success:true,
        message:"User registered successfully"
        },

        {status:200}
    )   

    } catch (error) 
    {
        console.log('error registering user',error);
        return Response.json(
            {success:false,
            message:"Error registering user"
            },

            {status:500}
        )
        
    }
}