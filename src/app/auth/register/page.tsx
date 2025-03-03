import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { RegisterForm } from "~/app/_components/user/create";
const page = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm></RegisterForm>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
