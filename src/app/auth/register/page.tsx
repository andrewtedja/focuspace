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
    <div className="flex h-screen w-screen">
      <div className="relative flex w-full items-center justify-center bg-gradient-to-br from-[#86B3D1] to-[#5aa182] p-8 md:w-1/2">
        <div className="absolute left-0 top-0 h-full w-full overflow-hidden"></div>

        <div className="relative z-10 max-w-md">
          <h1 className="mb-8 text-6xl font-bold tracking-tight text-white">
            <span className="block">Focus.</span>
            <span className="mt-2 block">Learn.</span>
            <span className="mt-2 block">Thrive.</span>
          </h1>

          <div className="mt-12 flex justify-center space-x-3">
            <div className="h-2 w-2 rounded-full bg-white/90"></div>
            <div className="h-2 w-2 rounded-full bg-white/60"></div>
            <div className="h-2 w-2 rounded-full bg-white/30"></div>
          </div>
        </div>

        <p className="absolute left-5 top-5 text-3xl font-bold text-white">
          FocuSpace
        </p>
      </div>
      <div className="flex w-1/2 items-center justify-center bg-[#F5F7FA]">
        <Card className="w-96 border-[#86B3D1]/20 bg-white/70 shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-[#2D3748]">
              Create your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm></RegisterForm>
          </CardContent>
          <CardFooter className="flex w-full justify-center">
            <Link
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
              href={"login"}
            >
              Already have an account?{" "}
              <span className="font-medium underline">Sign in</span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default page;
