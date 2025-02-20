"use client";

import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/user";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import {MessageCard} from "@/components/MessageCard";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();
  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptedMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: "Messages Refreshed",
          description: "Showing the latest messages",
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages,toast]);

  useEffect(() => {
    if ( !session||!session?.user) {
      fetchMessages();
      fetchAcceptedMessages();
    }
  }, [session, fetchMessages, fetchAcceptedMessages, toast,setValue]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/accept-message", {
        acceptMessage: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.messages,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${session?.user?.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Copied to Clipboard",
      description: "Profile URL copied successfully",
    });
  };
  

  if (!session || !session.user) {
    return <div>Please login</div>;
  }
  

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={`${window.location.protocol}//${window.location.host}/u/${session?.user?.username}`}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>

      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={() => fetchMessages(true)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
            key={message._id}
            message={message}
            onMessageDeleteAction={handleDeleteMessage}
          />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Page;

// "use client";

// import { useToast } from "@/hooks/use-toast";
// import { Message } from "@/model/user";
// import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
// import { ApiResponse } from "@/types/apiResponse";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios, { AxiosError } from "axios";

// import { useSession } from "next-auth/react";

// import { useForm } from "react-hook-form";

// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { Separator } from "@/components/ui/separator";
// import { Loader2, RefreshCcw } from "lucide-react";
// import { MessageCard } from '@/components/messageCard'
// import { useState } from "react";



// const page = () => {
// //   const [message, setMessage] = useState<Message[]>([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [isSwitchLoding, setIsSwitchLoding] = useState(false);

// const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSwitchLoading, setIsSwitchLoading] = useState(false);
//   const { toast } = useToast();
//   const handleDeleteMessage = async (messageId: string) => {
//     setMessage(message.filter((message) => message._id !== messageId));
//   };
//   const { data: session } = useSession();

//   const form = useForm({
//     resolver: zodResolver(acceptMessageSchema),
//   });
//   const { register, watch, setValue } = form;
//   const acceptMessages = watch("acceptMessages");
//   const fetchAcceptedMessages = useCallback(async () => {
//     setIsSwitchLoding(true);
//     try {
//       const response = await axios.get<ApiResponse>("/api/accept-message");
//       setValue("acceptMessages", response.data.isAcceptingMessage);
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast({
//         title: "Error",
//         description:
//           axiosError.response?.data.message ||
//           "Faild to fetch message settings",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSwitchLoding(false);
//     }
//   }, [setValue]);

//   const fetchMessages = useCallback(
//     async (refresh: boolean = false) => {
//       setIsLoading(true);
//       setIsSwitchLoding(false);
//       try {
//         const response = await axios.get<ApiResponse>("/api/get-messages");
//         setMessage(response.data.messages || []);
//         if (refresh) {
//           toast({
//             title: "Refreshed Messages",
//             description: "Showing latest messages",
//             variant: "destructive",
//           });
//         }
//       } catch (error) {
//         const axiosError = error as AxiosError<ApiResponse>;
//         toast({
//           title: "Error",
//           description:
//             axiosError.response?.data.message || "Faild to fetch messages",
//           variant: "destructive",
//         });
//       } finally {
//         setIsLoading(false);
//         setIsLoading(false);
//       }
//     },
//     [setIsLoading, setMessage]
//   );

//   useEffect(() => {
//     if (!session || !session.user) {
//       return;
//       fetchMessages();
//       fetchAcceptedMessages();
//     }
//   }, [session, setValue, fetchMessages, fetchAcceptedMessages]);

//   //handle switch change
//   const handleSwitchChange = async () => {
//     try {
//       const response = await axios.post("/api/accept-message", {
//         acceptMessage: !acceptMessages,
//       });
//       setValue("acceptMessages", !acceptMessages);
//       toast({
//         title: response.data.message,
//         variant: "destructive",
//       });
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast({
//         title: "Error",
//         description:
//           axiosError.response?.data.message || "Faild to fetch messages",
//         variant: "destructive",
//       });
//     }
//   };
//   const { username } = session?.user;
//   //DO more research
//   const baseUrl = `${window.location.protocol}//${window.location.host}`;
//   const profileUrl = `${baseUrl}/u/${username}`;
//   const copytoClipboard = () => {
//     navigator.clipboard.writeText(profileUrl);
//     toast({
//       title: "Copied to clipboard",
//       description: "Copied profile url to clipboard",
//     });
//   };
//   if (!session || !session.user) {
//     return <div>Please login</div>;
//   }

//   return (
//     <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
//       <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

//       <div className="mb-4">
//         <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
//         <div className="flex items-center">
//           <input
//             type="text"
//             value={profileUrl}
//             disabled
//             className="input input-bordered w-full p-2 mr-2"
//           />
//           <Button onClick={copytoClipboard }>Copy</Button>
//         </div>
//       </div>

//       <div className="mb-4">
//         <Switch
//           {...register("acceptMessages")}
//           checked={acceptMessages}
//           onCheckedChange={handleSwitchChange}
//           disabled={isSwitchLoding}
//         />
//         <span className="ml-2">
//           Accept Messages: {acceptMessages ? "On" : "Off"}
//         </span>
//       </div>
//       <Separator />

//       <Button
//         className="mt-4"
//         variant="outline"
//         onClick={(e) => {
//           e.preventDefault();
//           fetchMessages(true);
//         }}
//       >
//         {isLoading ? (
//           <Loader2 className="h-4 w-4 animate-spin" />
//         ) : (
//           <RefreshCcw className="h-4 w-4" />
//         )}
//       </Button>
//       <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
//         {message.length > 0 ? (
//           message.map((message, index) => (
//             <MessageCard
//               key={message._id}
//               message={message}
//               onMessageDelete={handleDeleteMessage}
//             />
//           ))
//         ) : (
//           <p>No messages to display.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default page;



