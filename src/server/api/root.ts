import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { verificationRouter } from "./routers/verification";
import { mailRouter } from "./routers/mail";
import { storageRouter } from "./routers/storage";
import { openaiRouter } from "./routers/openai";
import { pdfUploadRouter } from "./routers/pdfUpload";
import { messageRouter } from "./routers/message";
import { embeddingRouter } from "./routers/embedding";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  verification: verificationRouter,
  mail: mailRouter,
  storage: storageRouter,
  openai: openaiRouter,
  pdfUpload: pdfUploadRouter,
  message: messageRouter,
  embedding: embeddingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
