import resend from "resend";
import VerificationEmail from "../../emails/verificationEmails";    
import { ApiResponse } from "@/types/apiResponse";



export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: ' <onboarding@resend.dev>',
            to: email,
            subject: 'AnonymusMessage | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        })
        return {success:true,message:"Successfully sent verification email"}
    } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return {success:false,message:"Error sending verification email"}
        
    }
}