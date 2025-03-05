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
        if (!email && !password) return null;
        if (typeof email !== "string" || typeof password !== "string")
          return null;
        const user = await getUserByEmail(email);
        if (!user?.password) return null;

        return bcrypt.compare(password, user.password).then((passwordMatch) => {
          if (!passwordMatch) return null;
          return user;
        });
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
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
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
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
