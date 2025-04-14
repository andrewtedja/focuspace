import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Suspense } from "react";
import { LoginForm } from "~/app/_components/auth/login";
import Link from "next/link";
import AuthRoute from "~/app/_components/routes/authRoute";
const page = () => {
  return (
    <AuthRoute>
      <div className="flex h-screen w-screen flex-row">
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
              <CardTitle className="text-2xl">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <LoginForm></LoginForm>
              </Suspense>
            </CardContent>
            <CardFooter className="flex w-full justify-center">
              <Link
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                href={"register"}
              >
                Don&apos;t have an account?{" "}
                <span className="font-medium underline">Sign up</span>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AuthRoute>
  );
};

export default page;
