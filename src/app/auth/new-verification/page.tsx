"use client";
import React, { Suspense } from "react";
import NewVerificationForm from "~/app/_components/auth/new-verification-form";
import { SyncLoader } from "react-spinners";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
const page = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="flex w-full justify-center">
            Confirming your verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-full w-full items-center justify-center">
            <SyncLoader size={20}></SyncLoader>
          </div>
        </CardContent>
      </Card>
      <Suspense>
        <NewVerificationForm></NewVerificationForm>
      </Suspense>
    </div>
  );
};

export default page;
