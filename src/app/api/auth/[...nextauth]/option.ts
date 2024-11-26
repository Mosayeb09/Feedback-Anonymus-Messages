// import { NextAuthOptions } from "next-auth";

// import { CredentialsProvider } from "next-auth/providers/credentials";

// import  { bcrypt } from 'bcrypt';
// import { dbConnect } from "@/lib/dbConnect";
// import UserModel from "@/model/user";
// import { AuthOptions } from './../../../../../node_modules/next-auth/core/types.d';
// import email from './../../../../../node_modules/next-auth/core/lib/email/signin.d';



// export const authOptions: NextAuthOptions = {

//     providers: [

//         CredentialsProvider({
//             id:"credentials",
//             name:"Credentials",
//             credentials: {
//                 email: {label:"Email", type:"Text" },
//                 password: {label:"Password", type:"password" }
//                },
//             async authorize(credentials: any): Promise<any> {
//                 await dbConnect()

//                 try {
//                    const user = await UserModel.findOne({
//                         $or:[
//                             {email:credentials.identifier},
//                             {username:credentials.identifier}
//                         ]
//                     })
//                     if(!user){
//                         throw new Error("User not found with this email or username")
//                     }
//                     if(!user.isVerifyed){
//                         throw new Error("Please Verify your email before login")
//                     }
//                   const isPasswordCorrect =  await bcrypt.compare(credentials.password,user.password)
//                   if(isPasswordCorrect){
//                     return user
//                   }
//                   else{
//                     throw new Error("Incorrect password")
//                   }
                    
//                 } catch (err:any) {

//                     throw new Error(err)
                    
//                 }

//             }



            
            


        
//         })
        
//     ]
// }

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user";

export const authProviders = [
  CredentialsProvider({
    id: "credentials",
    name: "Credentials",
    credentials: {
      identifier: { label: "Email or Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials:Record<string, string> | undefined): Promise<{ id: string; name: string; email: string } | null> {
      if (!credentials?.identifier || !credentials?.password) {
        throw new Error("Please provide both identifier and password.");
      }

      await dbConnect();

      try {
        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        });

        if (!user) {
          throw new Error("User not found with this email or username.");
        }

        if (!user.isVerifyed) {
          throw new Error("Please verify your email before logging in.");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          return null;
        }
        return {
            id: user.id.toString(),
            name: user.username,
            email: user.email,
          };

        // Return the user object expected by next-auth
        
      } catch (err) {
        console.error("Authorization error:", err);
        throw new Error("Authentication failed. Please check your credentials.");
      }
    },
  }),
];
