"use client";
import React, { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const NewVerificationForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const newVerification = api.verification.newVerification.useMutation({
    onSuccess: (data) => {
      toast.success(data.success);
      router.push("/auth/login");
    },
    onError: (error) => {
      toast.success(error.message);
      router.push("/auth/login");
    },
  });
  const onSubmit = useCallback(() => {
    // return;
    if (!token) {
      toast.success("No token provided");
      router.push("/auth/login");
      return;
    }

    newVerification.mutate({ token });
  }, []);

  useEffect(() => {
    onSubmit();
  }, []);
  return <div></div>;
};

export default NewVerificationForm;
