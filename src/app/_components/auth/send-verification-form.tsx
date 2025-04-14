"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import CountdownTimer from "../countdown";
import { Mail } from "lucide-react";

const SendVerificationForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [start, setStart] = useState(false);
  const [reset, setReset] = useState(true);
  const [finish, setFinish] = useState(false);

  const generateToken = api.verification.generateVerificationToken.useMutation({
    onSuccess: (data) => {
      toast.success("Token successfully generated");
      sendVerificationEmail.mutate({ email: data.email, token: data.token });
    },
    onError: (error) => {
      toast.error(error.message);
      router.push("/auth/login");
    },
  });
  const sendVerificationEmail = api.mail.sendVerificationEmail.useMutation({
    onSuccess: () => {
      toast.success("Verification link successfully sent to email");
    },
    onError: () => {
      toast.error(
        "Something went wrong while sending verification link to email, please resend!",
      );
    },
  });

  const sendEmail = () => {
    if (!email) {
      toast.error("No email provided");
      router.push("/auth/login");
      return;
    }
    generateToken.mutate({ email });
  };

  return (
    <Card className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-md">
      <CardHeader className="rounded-t-lg border-b border-gray-100 bg-gray-50">
        <div className="mb-2 flex items-center justify-center">
          <Mail className="mr-2 h-6 w-6 text-[#68b3e6]" />
          <CardTitle className="text-xl font-semibold text-[#030303]">
            Send Verification Link to Email
          </CardTitle>
        </div>
        {email && (
          <div className="mt-1 text-center text-sm text-gray-600">{email}</div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center px-6 py-8">
        <div className="mb-2 flex h-24 w-24 items-center justify-center p-4">
          <CountdownTimer
            initialTime={60}
            start={start}
            reset={reset}
            setStart={setStart}
            setReset={setReset}
            setFinish={setFinish}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {start
            ? "Time remaining until you can resend"
            : "Click below to send verification"}
        </p>
      </CardContent>
      <CardFooter className="rounded-b-lg border-t border-gray-100 bg-gray-50 p-4">
        <Button
          className="w-full rounded-md bg-[#86B3D1] py-2 text-white hover:bg-[#86B3D1]"
          disabled={start && !finish}
          onClick={() => {
            if (finish) {
              setReset(true);
            }
            setTimeout(() => setStart(true), 1);
            sendEmail();
          }}
        >
          {start ? "Resend email" : "Send email"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SendVerificationForm;
