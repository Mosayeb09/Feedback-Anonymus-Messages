import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from 'next/server'; // Import NextResponse

const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const { username, email, password } = await request.json();

    // Check for existing verified user by username
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "User already exists" }),
        { status: 400 }
      );
    }

    // Check for existing user by email
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      // If email exists but not verified
      if (existingUserByEmail.isVerified) {
        return new NextResponse(
          JSON.stringify({ success: false, message: "User already exists with this email" }),
          { status: 400 }
        );
      } else {
        // If email exists and not verified, update password and verification code
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await existingUserByEmail.save();
      }
    } else {
      // Create new user if no existing user with this email
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if (!emailResponse.success) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Error sending verification email" }),
        { status: 500 }
      );
    }

    return new NextResponse(
      JSON.stringify({ success: true, message: "User registered successfully" }),
      { status: 200 }
    );
    
  } catch (error) {
    console.log('Error registering user:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Error registering user" }),
      { status: 500 }
    );
  }
}



// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/user";
// import bcrypt from "bcrypt";

// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
// // import UserModel from './../../../model/user';

// const verifyCode = Math.floor(100000+Math.random() * 900000).toString();
// export async function POST(request: Request) {
//     await dbConnect();
//     try {
//        const {username,email,password} = await request.json();
//       const existingUserVerifiedByUsername = await UserModel.findOne({
//         username,
//         isVerified:true
//        })
//        if(existingUserVerifiedByUsername)
//        {
//         return Response.json(

//             {success:false,
//             message:"User already exists"
//             },

//             {status:400}
//         )
//        }
//       const existingUserByEmail = await UserModel.findOne({
//         email,
//       })
//       if(existingUserByEmail)
//       {
//         //if email exsit but not verified
        
//         if(existingUserByEmail.isVerified)
//         {
//           return Response.json(
//             {success:false,
//             message:"User already exists with this email"
//             },


//             {status:400}
//         )
//         }
//         else{
//           const hashedPassword = await bcrypt.hash(password, 10);
//           existingUserByEmail.password = hashedPassword;existingUserByEmail.verifyCode = verifyCode;existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
//           existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
//           await existingUserByEmail.save();

//         }
//       }
//       else{
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const  newUser = await UserModel.create({
//             username,
//             email,
//             password: hashedPassword,
//             verifyCode,
//             verifyCodeExpiry: new Date(Date.now() + 3600000),
//             isVerified: false,
//             isAcceptingMessage: true,
//             messages: [],
//           });
//           await newUser.save();
          
//       }
//       //send verification email
//       const emailResponse = await sendVerificationEmail(email,username,verifyCode)
//       if(!emailResponse.success)
//       {
//         return Response.json(
//             {success:false,
//             message:"Error sending verification email"
//             },

//             {status:500}
//         )
//       }
//       return Response.json(
//         {success:true,
//         message:"User registered successfully"
//         },

//         {status:200}
//     )   

//     } catch (error) 
//     {
//         console.log('error registering user',error);
//         return Response.json(
//             {success:false,
//             message:"Error registering user"
//             },

//             {status:500}
//         )
        
//     }
// }