import React, { Suspense } from "react";
import SendVerificationForm from "~/app/_components/auth/send-verification-form";

const page = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Suspense>
        <SendVerificationForm></SendVerificationForm>
      </Suspense>
    </div>
  );
};

export default page;
