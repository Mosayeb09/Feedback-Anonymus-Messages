'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { signupSchema } from "@/schemas/signUpSchema"
import { set } from "mongoose"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiResponse"


const page = () => {
    const [userName, setUserName] = useState("");
    const [userNameMessage, setUserNameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debouncedUserName = useDebounceValue(userName, 300);
    const { toast } = useToast();
    const router = useRouter();

    //zod implementation
    const form = useForm<z.infer<typeof signupSchema>({
        resolver:zodResolver(signupSchema),
        defaultValues:{
            username:"",
            email:"",
            password:""
        }
    })
    useEffect(() => {
        const checkUserNameUniqueness = async () => {
            if(debouncedUserName){
                setIsCheckingUsername(true);
                setUserNameMessage("");
                try {
                  const  response = await axios.get(`/api/check-username-unique?username=${debouncedUserName}`);
                  setUserNameMessage(response.data.message);
            }
            catch(error){
                const axiosError = error as AxiosError<ApiResponse>;
                setUserNameMessage(axiosError.response?.data.message??"Error checking username");
                

            }
            finally{
                setIsCheckingUsername(false);
            }
            
        }
    }
    checkUserNameUniqueness();}, [debouncedUserName])
    return (
        <div>
        
        </div>
    );
};

export default page;


