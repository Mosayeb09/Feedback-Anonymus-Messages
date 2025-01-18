// import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {NextAuthOptions, User}  from "next-auth";
// import {prisma} from '@/lib/prisma';
// import type AuthOptions  from "next-auth";



export const authOptions: NextAuthOptions ={
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials){
        
        await dbConnect();
        const user = await UserModel.findOne({
          $or: [
            { email:credentials.identifier },
            { username:credentials.identifier },
          ],
        
        })
        if(!user){
          throw new Error("User not found");
        }
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        )
        if(!isPasswordCorrect){
          throw new Error("Incorrect password");
        }
        if(!user.isVerified){
          throw new Error("Please verify your email before logging in.");
        }
      }
      }
    )
  ],
  // providers: [
  //   CredentialsProvider({
  //     id: "credentials",
  //     name: "Credentials",
  //     credentials: {
  //       identifier: { label: "Email or Username", type: "text" },
  //       password: { label: "Password", type: "password" },
  //     },
  //     async authorize(
  //       credentials: Record<"identifier" | "password", string> | undefined
  //     ): Promise<User | null> {
  //       if (!credentials) {
  //         throw new Error("Missing credentials.");
  //       }
      
  //       const { identifier, password } = credentials;
  //     //  async authorize(credentials: any): Promise<any> { //hello
  //     if (!identifier || !password) {
  //       throw new Error("Please provide both identifier and password.");
  //     }
        

  //       await dbConnect();

  //       try {
  //         const user = await UserModel.findOne({
  //           $or: [
  //             { email: credentials.identifier },
  //             { username: credentials.identifier },
  //           ],
  //         });

  //         if (!user) {
  //           throw new Error("User not found with this email or username.");
  //         }

  //         if (!user.isVerified) {
  //           throw new Error("Please verify your email before logging in.");
  //         }

  //         const isPasswordCorrect = await bcrypt.compare(
  //           credentials.password,
  //           user.password
  //         );

  //         if (!isPasswordCorrect) {
  //           return null; // Return null if the password is incorrect
  //         }
  //         return {
  //           id: user._id?.toString() ?? "",
  //           email: user.email,
  //           username: user.username,
  //           isVerified: user.isVerified,
  //           isAcceptingMessage: user.isAcceptingMessage,
  //         };

          
  //       } catch (err) {
  //         console.error("Authorization error:", err);
  //         throw new Error("Authentication failed. Please check your credentials.");
  //       }
  //     },
  //   }),
  // ],
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
 
  session: {
    strategy: "jwt", // Use JWT-based sessions
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in", // Custom sign-in page
  }
   
};


















