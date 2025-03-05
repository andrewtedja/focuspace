import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { LoginForm } from "~/app/_components/auth/login";
import Link from "next/link";
const page = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm></LoginForm>
        </CardContent>
        <CardFooter className="flex w-full justify-center">
          <Link
            className="text-sm underline hover:opacity-60"
            href={"register"}
          >
            Don&apost have an account?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
