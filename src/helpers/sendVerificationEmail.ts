// import {resend} from "@/lib/resend";
import { Resend } from "resend"
import VerificationEmail from "../../emails/verificationEmails";   
// import resend from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);

//  const resend = new Resend(process.env.RESEND_API_KEY);
// const resend = new Resend('process.env.RESEND_API_KEY');

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'AnonymousMessage <onboarding@resend.dev>',
            to: email,
            subject: 'AnonymousMessage | Verify your email',
            react: VerificationEmail({ username, otp: verifyCode }),
        })
        return {success:true,message:"Successfully sent verification email"}
    } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return {success:false,message:"Error sending verification email"}
        
    }
}