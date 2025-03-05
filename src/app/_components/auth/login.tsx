"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";
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

export const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email format.",
  }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const login = api.user.login.useMutation({
    onSuccess: (response) => {
      if (response?.error) {
        toast.error("Email not verified");
        router.push(`/auth/send-verification?email=${response.error}`);
      } else {
        toast.success(response?.success);
        router.push("/room");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function onSubmitCredentials(values: z.infer<typeof formSchema>) {
    login.mutate({
      provider: "credentials",
      email: values.email,
      password: values.password,
    });
  }

  async function onSubmitProvider() {
    try {
      await signIn("google", { redirect: true, redirectTo: "/room" }).then(
        () => {
          toast.success("Login successful!");
        },
      );
    } catch {
      toast.error("An error occured!");
    }
  }
  return (
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
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>

      <Button
        onClick={onSubmitProvider}
        variant={"secondary"}
        className="mt-2 w-full"
      >
        Sign in with
        <FaGoogle></FaGoogle>
      </Button>
    </Form>
  );
}
