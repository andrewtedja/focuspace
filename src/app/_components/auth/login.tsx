"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaGoogle } from "react-icons/fa";
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
  }, []);

  const displayError = (error: String | null, email?: String) => {
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
            className="w-full"
            disabled={isPendingCredentials}
          >
            Login
            {isPendingCredentials && "..."}
          </Button>
        </form>

        <Button
          onClick={onSubmitProvider}
          variant={"secondary"}
          className="mt-2 w-full"
          disabled={isPendingProvider}
        >
          Sign in with
          <FaGoogle></FaGoogle>
          {isPendingProvider && "..."}
        </Button>
      </Form>
    </AuthRoute>
  );
}
