'use client'
import * as React from "react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import Link from "next/link";
import { verifySchema } from "@/schemas/verifySchema"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { APIresponse } from "@/types/APIresponse";
import { toast, useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import UserModel from "@/model/User.model";


const VerifyUsername = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    console.log(params)
    // const [value, setValue] = React.useState("");
    // const [isSubmitting, setIsSubmitting] = React.useState(false);

    // async function findEmail() {
    //     const email = await UserModel.findOne({ params });
    //     console.log(email);
    // }
    // findEmail();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });



    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<APIresponse>("/api/verify-code", {
                username: params.username,
                code: data.code
            });
            toast({
                title: "User verified",
                description: response.data.message,
            });
            router.replace(`/sign-in`);
        } catch (error) {
            console.log("Error in signup of user", error);
            const axiosError = error as AxiosError<APIresponse>;
            toast({
                title: "Signup failed",
                description: axiosError.response?.data.message,
                variant: "destructive",
            });
        }
    }

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Verify Your Account
                        </h1>
                        <p className="mb-4">Enter the verification code sent to your email</p>
                    </div>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                                <FormField
                                    name="code"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>One-Time Password</FormLabel>
                                            <FormControl>
                                                <InputOTP maxLength={6} {...field}>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormDescription>
                                                Please enter the one-time password sent to your phone.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VerifyUsername
