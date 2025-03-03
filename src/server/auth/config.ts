import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "helper";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials.email;
        const password = credentials.password;
        if (!email && !password) return null;
        if (typeof email !== "string" || typeof password !== "string")
          return null;
        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;
        const passwordMatch = bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log(user, account);
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserByEmail(user.email);
      if (!existingUser?.emailVerified) return false;
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(db),
} satisfies NextAuthConfig;
