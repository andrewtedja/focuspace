import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "~/helper";

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials.email;
        const password = credentials.password;
        if (!email || !password)
          throw new Error("Email and password are required.");

        if (typeof email !== "string" || typeof password !== "string")
          throw new Error("Invalid input: Email and password must be strings.");

        const user = await getUserByEmail(email);
        if (!user) throw new Error("User not found.");

        if (!user.password)
          throw new Error("User account is missing a password.");

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw new Error("Incorrect password.");

        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserByEmail(user.email);
      if (!existingUser?.emailVerified) return false;
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    colorScheme: "light",
  },
  adapter: PrismaAdapter(db),
} satisfies NextAuthConfig;
