import { Message } from "@/model/user";
export interface ApiResponse {
    success: boolean;
    
    message: string;
    isAcceptigMessage?: boolean
    messages?:Array<Message>
}