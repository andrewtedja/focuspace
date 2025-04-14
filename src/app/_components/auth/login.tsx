"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import AuthRoute from "../routes/authRoute";
// import { DEFAULT_LOGIN_REDIRECT } from "routes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import Link from "next/link";

export const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email format.",
  }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function LoginForm() {
  const [isPendingCredentials, setIsPendingCredentials] = useState(false);
  const [isPendingProvider, setIsPendingProvider] = useState(false);

  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  useEffect(() => {
    if (error) {
      displayError(error);
    }
  }, [error]);

  const displayError = (error: string | null, email?: string) => {
    switch (error) {
      case "AccessDenied":
        toast.error(
          <div>
            Email not verified, verify your email{" "}
            <Link
              href={`/auth/send-verification?email=${email}`}
              className="underline"
            >
              here
            </Link>
            !
          </div>,
          { duration: 5000 },
        );
        break;
      case "Configuration":
        toast.error("Invalid credentials!");
        break;
      case "OAuthAccountNotLinked":
        toast.error("Sign in with Google failed!");
        break;
      default:
        toast.error("An error occured while signing you in!");
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmitCredentials(values: z.infer<typeof formSchema>) {
    setIsPendingCredentials(true);
    try {
      // try to sign in with credentials
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (result?.error) {
        displayError(result.error, values.email);
      }
    } catch {
      // something unexpected happened!
      toast.error("Something went wrong!");
    }
    setIsPendingCredentials(false);
  }

  async function onSubmitProvider() {
    setIsPendingProvider(true);
    try {
      await signIn("google", {
        redirect: true,
        redirectTo: "/auth/login",
      });
    } catch {
      toast.error("Something went wrong!");
    }
    setIsPendingProvider(false);
  }

  return (
    <AuthRoute>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitCredentials)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-[#86B3D1] text-white hover:bg-[#7AA3C1]"
            disabled={isPendingCredentials}
          >
            Login
            {isPendingCredentials && "..."}
          </Button>
        </form>

        <Button
          onClick={onSubmitProvider}
          variant={"secondary"}
          className="mt-2 w-full hover:bg-gray-200"
          disabled={isPendingProvider}
        >
          Sign in with
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="144"
            height="144"
            viewBox="0 0 48 48"
          >
            <path
              fill="#fbc02d"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#e53935"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4caf50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1565c0"
              d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          {isPendingProvider && "..."}
        </Button>
      </Form>
    </AuthRoute>
  );
}
