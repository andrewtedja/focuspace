"use client";
import React, { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SyncLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="flex w-full justify-center">
          Confirming your verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-full w-full items-center justify-center">
          <SyncLoader loading={true} size={20}></SyncLoader>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewVerificationForm;
