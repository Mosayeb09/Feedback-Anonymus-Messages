"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { signupSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
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
import { Loader2 } from "lucide-react";

const Page = () => {
    const [userName, setUserName] = useState("");
    const [userNameMessage, setUserNameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debouncedUserName = useDebounceValue(userName, 300);
    const { toast } = useToast();
    const router = useRouter();
  
    // Initialize the form with zod schema
    const form = useForm<z.infer<typeof signupSchema>>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
        username: "",
        email: "",
        password: "",
      },
    });

  //zod implementation
  

  useEffect(() => {
    const checkUserNameUniqueness = async () => {
      const [debouncedValue] = debouncedUserName;

      if (debouncedValue) {
        setIsCheckingUsername(true);
        setUserNameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${encodeURIComponent(
              debouncedValue)}`
          );
          console.log("API Response:", response.data);
          setUserNameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUserNameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUserNameUniqueness();
  }, [debouncedUserName]);
  const onSubmit = async (Data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", Data);
      toast({
        title: "success",
        description: response.data.message,
      });
      router.replace(`/verify/${userName}`);
      setIsSubmitting(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Sign up failed",
        description: axiosError.response?.data.message,
      });
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Anonymous Messages
          </h1>
          <p className="mb-4"> sign up to start your anonymous conversation</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUserName(e.target.value);
                      }}
                    />
                  </FormControl>
                  <p className="text-sm text-gray-500">
                    {isCheckingUsername
                      ? "Checking availability..."
                      : userNameMessage}
                  </p>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUserName(e.target.value);
                      }}
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
                      placeholder="password"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUserName(e.target.value);
                      }}
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
            {/* <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                    
                          </FormControl>

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
                            <Input type="password"
                              placeholder="password"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setUserName(e.target.value);
                              }}
                            />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            /> */}
            
            <Button type="submit" disabled={isCheckingUsername || isSubmitting}>
              {
                isSubmitting ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> please wait
                  </>
                ):("Signup")
              }
            </Button>
          </form>
        </Form>
        <div>
          <p>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-500 hover:text-blue-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;





// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useDebounceValue } from "usehooks-ts";
// import { useToast } from "@/hooks/use-toast";
// import { signupSchema } from "@/schemas/signUpSchema";
// import axios, { AxiosError } from "axios";
// import { ApiResponse } from "@/types/apiResponse";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";

// const Page = () => {
//   const [userName, setUserName] = useState("");
//   const [userNameMessage, setUserNameMessage] = useState("");
//   const [isCheckingUsername, setIsCheckingUsername] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const debouncedUserName = useDebounceValue(userName, 300);
//   const { toast } = useToast();
//   const router = useRouter();

//   // Initialize the form with zod schema
//   const form = useForm<z.infer<typeof signupSchema>>({
//     resolver: zodResolver(signupSchema),
//     defaultValues: {
//       username: "",
//       email: "",
//       password: "",
//     },
//   });

//   useEffect(() => {
//     const checkUserNameUniqueness = async () => {
//       if (debouncedUserName) {
//         setIsCheckingUsername(true);
//         setUserNameMessage("");
//         try {
//           const response = await axios.get(
//             `/api/check-username-unique?username=${debouncedUserName}`
//           );
//           setUserNameMessage(response.data.message);
//         } catch (error) {
//           const axiosError = error as AxiosError<ApiResponse>;
//           setUserNameMessage(
//             axiosError.response?.data.message ?? "Error checking username"
//           );
//         } finally {
//           setIsCheckingUsername(false);
//         }
//       }
//     };

//     checkUserNameUniqueness();
//   }, [debouncedUserName]);

//   const onSubmit = async (data: z.infer<typeof signupSchema>) => {
//     setIsSubmitting(true);
//     try {
//       const response = await axios.post<ApiResponse>("/api/sign-up", data);
//       toast({
//         title: "Success",
//         description: response.data.message,
//       });
//       router.replace(`/verify/${data.username}`);
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast({
//         title: "Sign up failed",
//         description: axiosError.response?.data.message ?? "An error occurred.",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
//             Join Anonymous Messages
//           </h1>
//           <p className="mb-4">Sign up to start your anonymous conversation</p>
//         </div>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               name="username"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Username</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Username"
//                       {...field}
//                       onChange={(e) => {
//                         field.onChange(e);
//                         setUserName(e.target.value);
//                       }}
//                     />
//                   </FormControl>
//                   <p className="text-sm text-gray-500">
//                     {isCheckingUsername
//                       ? "Checking availability..."
//                       : userNameMessage}
//                   </p>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="email"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Email" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="password"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input type="password" placeholder="Password" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit" disabled={isCheckingUsername || isSubmitting}>
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
//                 </>
//               ) : (
//                 "Sign Up"
//               )}
//             </Button>
//           </form>
//         </Form>
//         <div className="mt-4 text-center">
//           <p>
//             Already have an account?{" "}
//             <Link href="/sign-in" className="text-blue-500 hover:text-blue-600">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;
