import { Resend } from "resend";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendVerificationEmail(token: string, email: string) {
//   console.log("sending email...");
//   const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
//   await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: email,
//     subject: "Confirm your email",
//     html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
//   });
// }

export const mailRouter = createTRPCRouter({
  sendVerificationEmail: publicProcedure
    .input(z.object({ token: z.string(), email: z.string().email() }))
    .mutation(async ({ input }) => {
      const confirmLink = `http://localhost:3000/auth/new-verification?token=${input.token}`;
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: input.email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
      });
    }),
});
