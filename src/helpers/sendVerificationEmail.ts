import { Resend } from 'resend';
import VerificationEmail from "../../emails/verificationEmails";    
import { ApiResponse } from "@/types/apiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'AnonymusMessage <no-reply@anonymusmessage.com>',
            to: email,
            subject: 'Verify your email',
            react: VerificationEmail({ username, otp: verifyCode }),
        })
        return {success:true,message:"Successfully sent verification email"}
    } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return {success:false,message:"Error sending verification email"}
        
    }
}