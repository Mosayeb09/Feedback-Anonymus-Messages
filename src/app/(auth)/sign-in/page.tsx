"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
// import { signupSchema } from "@/schemas/signUpSchema";
// import axios, { AxiosError } from "axios";
// import { ApiResponse } from "@/types/apiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
// import { to } from './../../../../.next/static/chunks/[turbopack]_browser_dev_hmr-client_d6d8d4._';

const Page = () => {
  
  
  
  const { toast } = useToast();
  const router = useRouter();

  // Initialize the form with zod schema
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      
      identifier: "",
      password: "",
    },
  });

  //zod implementation

  
  const onSubmit = async (Data: z.infer<typeof signInSchema>) => {
   const result = await signIn("credentials", {
      redirect: false,
      identifier: Data.identifier,
      password: Data.password,
    })
    if (result?.error) {
      // 
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Sign in failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      } 
      else {
        toast({
          title: "Sign in failed",
          description: result.error,
          variant: "destructive",
        });
      }
  };
 if(result?.url){
  router.replace('/dashboard');
 }
}
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Anonymous Messages
          </h1>
          <p className="mb-4"> Sign in to start your anonymous conversation</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email / Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email / username"
                      {...field}
                      
                    />
                  </FormControl>
                  {/* <p className="text-sm text-gray-500">
                    {isCheckingUsername
                      ? "Checking availability..."
                      : userNameMessage}
                  </p> */}

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                     
                    />
                  </FormControl>
                  {/* <p className="text-sm text-gray-500">
                    {isCheckingUsername
                      ? "Checking availability..."
                      : userNameMessage}
                  </p> */}

                  <FormMessage />
                </FormItem>
              )}
            />
            

            <Button type="submit" >
              Signin
            </Button>
          </form>
        </Form>
        <div>
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-500 hover:text-blue-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;


