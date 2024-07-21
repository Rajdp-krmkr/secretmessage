'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from "axios";
import { APIresponse } from "@/types/APIresponse";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";


const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log("result", result);
    if (result?.error) {
      toast({
        title: "Login Failed",
        description: "Incorrect username or password",
        variant: "destructive",
      })
    }

    if (result?.url) {
      router.replace('/dashboard')
    }




  }

  return (
    <div className="flex justify-center items-center
      min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white
      rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Secret Message
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email/Username" {...field}
                      // onChange={e => {
                      //   field.onChange(e);
                      //   setUsername(e.target.value)
                      // }} 
                      />
                    </FormControl>


                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field}
                      // onChange={e => {
                      //   field.onChange(e);
                      //   setUsername(e.target.value)
                      // }} 
                      />

                    </FormControl>


                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center m-1">
                <Button type="submit">
                  Sign in
                </Button>
              </div>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p className=" flex gap-2 justify-center items-center">
              <span>Don't have an account?</span>
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800" >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
