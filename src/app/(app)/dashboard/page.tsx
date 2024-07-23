'use client'
import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message, User } from '@/model/User.model';
import { acceptMessagesSchema } from '@/schemas/acceptMessagesSchema';
import { APIresponse } from '@/types/APIresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { use, useCallback, useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form';

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();
  const handleDeleteMessage = (messageId: string) => {
    setMessages((messages.filter((message) => message._id !== messageId)));
  }
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema)
  })
  const { register, watch, setValue } = form;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const responce = await axios.get<APIresponse>('/api/accept-messages');
      setValue('acceptMessages', responce.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<APIresponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Something went wrong, failed to fetch accepted messages',
        variant: 'destructive'
      })
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<APIresponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: 'Refreshed',
          description: 'Messages refreshed successfully',

        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<APIresponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Something went wrong, failed to fetch messages',
        variant: 'destructive'
      })

    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setMessages]);

  useEffect(() => {
    if (!session || !session.user) { return }
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<APIresponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default'
      })
    } catch (error) {
      const axiosError = error as AxiosError<APIresponse>;
      toast({
        title: 'Something went wrong',
        description: axiosError.response?.data.message || 'Error setting accepting messages',
        variant: 'destructive'
      })
    }
  }

  if (!session || !session.user) {

    return (
      <div>
        <h1 className='text-lg'>Please <Link href="/sign-in"><span className='text-blue-500 hover:underline'>sign in</span></Link></h1>
      </div>
    )
  }
  const {username} = session?.user as User;

  const baseURL = `${window.location.protocol}//${window.location.host}`
  const profileURL = `${baseURL}/u/${username}`;
  console.log(baseURL)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL);
  }
  
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileURL}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <div className='bg-gray-500 w-[90vw] h-px'></div>

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index} //! Changed to index from message._id
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );

}

export default Dashboard
