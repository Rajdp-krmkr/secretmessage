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


const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500)


  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {

        try {
          setIsCheckingUsername(true);
          setUsernameMessage("");
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          console.log(response)
          console.log(response.data)
          console.log(response.data.message)
          setUsernameMessage(response.data.message);
          console.log(isCheckingUsername);
        } catch (error) {
          const axiosError = error as AxiosError<APIresponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "An error occurred");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }
    checkUsernameUnique();
  }, [username]);


  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<APIresponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.log("Error in signup of user", error);
      const axiosError = error as AxiosError<APIresponse>;
      let errorMessage = axiosError.response?.data.message ?? "An error occurred";
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",

      });
    } finally {
      setIsSubmitting(false)
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
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field}
                        onChange={e => {
                          field.onChange(e);
                          debounced(e.target.value)
                        }} />

                    </FormControl>
                    {
                      isCheckingUsername && <Loader2 className="animate-spin" />
                    }
                      <p className={`text-sm ${usernameMessage === "Username is unique"? 'text-green-500': 'text-red-500'}` }>
                        {usernameMessage}
                      </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field}
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
                <Button type="submit" disabled={isSubmitting}>

                  {
                    isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                      </>
                    ) : "Sign Up"
                  }
                </Button>
              </div>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p className=" flex gap-2 justify-center items-center">
              <span>Already have an account?</span>
              <Link href="/sign-in" className="text-blue-600 hover:text-blue-800" >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
