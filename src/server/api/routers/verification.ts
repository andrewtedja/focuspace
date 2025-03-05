import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";
import { v4 as uuidv4 } from "uuid";

// export async function generateVerificationToken(email: string) {
//   const token = uuidv4();
//   const expires = new Date(new Date().getTime() + 3600 * 1000);
//   const existingToken = await db.verificationToken.findFirst({
//     where: { email },
//   });
//   if (existingToken) {
//     await db.verificationToken.delete({
//       where: {
//         id: existingToken.id,
//       },
//     });
//   }
//   const verificationToken = await db.verificationToken.create({
//     data: {
//       email,
//       token,
//       expires,
//     },
//   });
//   return verificationToken;
// }

export const verificationRouter = createTRPCRouter({
  newVerification: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingToken = await ctx.db.verificationToken.findUnique({
        where: { token: input.token },
      });
      if (!existingToken) throw new Error("Token does not exist!");
      const hasExpired = new Date(existingToken.expires) < new Date();
      if (hasExpired) throw new Error("Token has expired!");
      const existingUser = await ctx.db.user.findUnique({
        where: {
          email: existingToken.email,
        },
      });
      if (!existingUser) throw new Error("Email does not exist!");

      await ctx.db.user.update({
        where: { id: existingUser.id },
        data: {
          emailVerified: new Date(),
          email: existingToken.email,
        },
      });

      await db.verificationToken.delete({
        where: { id: existingToken.id },
      });

      return { success: "Email verified!" };
    }),
  generateVerificationToken: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (!existingUser) throw new Error("Email does not exist!");
      if (existingUser.emailVerified) throw new Error("Email is verified!");
      const token = uuidv4();
      const expires = new Date(new Date().getTime() + 3600 * 1000);
      const existingToken = await ctx.db.verificationToken.findFirst({
        where: { email: input.email },
      });
      if (existingToken) {
        await db.verificationToken.delete({
          where: {
            id: existingToken.id,
          },
        });
      }
      const verificationToken = await db.verificationToken.create({
        data: {
          email: input.email,
          token,
          expires,
        },
      });
      return verificationToken;
    }),
});
