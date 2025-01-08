'use client'

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/model/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/apiResponse';

type MessageCardProps = {
  messages: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    } 
  };

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}


// "use client";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "./ui/button";
// import { X } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";



// type MessageCardProps = {
//     message: Message;
//     onMessageDelete:( messageId:string)=>void
// }

// function messageCard({message,onMessageDelete}:MessageCardProps) {
//     const {toast} = useToast()
//     const handleDeleteConfirm = async() => {
//         const response =await axios.delete(`/api/delete-messages/${message._id}`)
//         toast({
//             title:response.data.message
//         })
//         onMessageDelete(message._id)
        
//     }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Card Title</CardTitle>
//         <AlertDialog>
//           <AlertDialogTrigger asChild>
//             <Button variant="destructive"><X className="h-4 w-4"/></Button>
//           </AlertDialogTrigger>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 This action cannot be undone. This will permanently delete your
//                 account and remove your data from our servers.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//         <CardDescription>Card Description</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <p>Card Content</p>
//       </CardContent>
//       <CardFooter>
//         <p>Card Footer</p>
//       </CardFooter>
//     </Card>
//   );
// }

// export default messageCard;
