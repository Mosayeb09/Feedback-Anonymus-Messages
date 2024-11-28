// import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {NextAuthOptions, User}  from "next-auth";
// import type AuthOptions  from "next-auth";

export const authOptions: NextAuthOptions ={
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"identifier" | "password", string> | undefined
      ): Promise<User | null> {
        if (!credentials) {
          throw new Error("Missing credentials.");
        }
      
        const { identifier, password } = credentials;
      //  async authorize(credentials: any): Promise<any> { //hello
      if (!identifier || !password) {
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
            return null; // Return null if the password is incorrect
          }

          return {
            id: user.id.toString(),
            _id: user._id?.toString(),
            email: user.email,
            username: user.username,
            isVerified: user.isVerifyed,
            isAcceptingMessage: user.isAcceptingMessage,
            
            
            // id: user.id.toString(),

            // id:user._id?.toString(),
            // name:user.username,
            // email: user.email,
            // _id: user._id?.toString(),
            // isVerified: user.isVerifyed,
            // isAcceptingMessage: user.isAcceptingMessage,
            // username: user.username,
          };
        } catch (err) {
          console.error("Authorization error:", err);
          throw new Error("Authentication failed. Please check your credentials.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in", // Custom sign-in page
  },
  session: {
    strategy: "jwt", // Use JWT-based sessions
  },
  secret: process.env.NEXTAUTH_SECRET,
   
};



















// // import { NextAuthOptions } from "next-auth";

// // import { CredentialsProvider } from "next-auth/providers/credentials";

// // import  { bcrypt } from 'bcrypt';
// // import { dbConnect } from "@/lib/dbConnect";
// // import UserModel from "@/model/user";
// // import { AuthOptions } from './../../../../../node_modules/next-auth/core/types.d';
// // import email from './../../../../../node_modules/next-auth/core/lib/email/signin.d';



// // export const authOptions: NextAuthOptions = {

// //     providers: [

// //         CredentialsProvider({
// //             id:"credentials",
// //             name:"Credentials",
// //             credentials: {
// //                 email: {label:"Email", type:"Text" },
// //                 password: {label:"Password", type:"password" }
// //                },
// //             async authorize(credentials: any): Promise<any> {
// //                 await dbConnect()

// //                 try {
// //                    const user = await UserModel.findOne({
// //                         $or:[
// //                             {email:credentials.identifier},
// //                             {username:credentials.identifier}
// //                         ]
// //                     })
// //                     if(!user){
// //                         throw new Error("User not found with this email or username")
// //                     }
// //                     if(!user.isVerifyed){
// //                         throw new Error("Please Verify your email before login")
// //                     }
// //                   const isPasswordCorrect =  await bcrypt.compare(credentials.password,user.password)
// //                   if(isPasswordCorrect){
// //                     return user
// //                   }
// //                   else{
// //                     throw new Error("Incorrect password")
// //                   }
                    
// //                 } catch (err:any) {

// //                     throw new Error(err)
                    
// //                 }

// //             }



            
            


        
// //         })
        
// //     ]
// // }


// import  { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import { dbConnect } from "@/lib/dbConnect";
// import UserModel from "@/model/user";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         identifier: { label: "Email or Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(
//         credentials: Record<"identifier" | "password", string> | undefined
//       ): Promise< null> {
//         if (!credentials) {
//           throw new Error("Missing credentials.");
//         }
      
//         const { identifier, password } = credentials;

//         await dbConnect();

//         try {
//           const user = await UserModel.findOne({
//             $or: [{ email: identifier }, { username: identifier }],
//           });

//           if (!user) {
//             throw new Error("User not found with this email or username.");
//           }

//           if (!user.isVerifyed) {
//             throw new Error("Please verify your email before logging in.");
//           }

//           const isPasswordCorrect = await bcrypt.compare(password, user.password);

//           if (!isPasswordCorrect) {
//             return null; // Incorrect password
//           }

//           return {
//             id: user.id.toString(),
//             name: user.username,
//             email: user.email,
//           };
//         } catch (err) {
//           console.error("Authorization error:", err);
//           throw new Error("Authentication failed. Please check your credentials.");
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token._id = user.id; // Ensure this matches your user model
//         token.username = user.name;
//         token.email = user.email;
//         token.isVerified = true; // Add custom fields as needed
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user = {
//           id: token._id,
//           username: token.username,
//           email: token.email,
//           isVerified: token.isVerified,
//         };
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/sign-in",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };
