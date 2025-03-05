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
    <Card className="">
      <CardHeader>
        <CardTitle className="flex w-full justify-center">
          Send Verification Link to Email
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full w-full items-center justify-center">
        <CountdownTimer
          initialTime={60}
          start={start}
          reset={reset}
          setStart={setStart}
          setReset={setReset}
          setFinish={setFinish}
        ></CountdownTimer>
      </CardContent>
      <CardFooter className="flex w-full justify-between">
        <Button
          className="w-full"
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
