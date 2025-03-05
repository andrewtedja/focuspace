import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { RegisterForm } from "~/app/_components/auth/register";
import Link from "next/link";
const page = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm></RegisterForm>
        </CardContent>
        <CardFooter className="flex w-full justify-center">
          <Link className="text-sm underline hover:opacity-60" href={"login"}>
            Already have an account?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
