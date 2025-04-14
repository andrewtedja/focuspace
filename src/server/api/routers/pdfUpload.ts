import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { createSupabaseServerClient } from "~/server/supabase";
export const pdfUploadRouter = createTRPCRouter({
  uploadAndReplacePdf: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        base64: z.string(),
        fileUuid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) throw new Error("User not authenticated");

      const supabase = await createSupabaseServerClient();

      const existingFile = await db.file.findFirst({ where: { userId } });
      if (existingFile) {
        await db.embeddingChunk.deleteMany({
          where: { fileId: existingFile.id },
        });
        await db.file.delete({ where: { id: existingFile.id } });
        await supabase.storage
          .from("uploads")
          .remove([existingFile.fileUuid + ".pdf"]);
      }

      // Upload new file
      const fileBuffer = Buffer.from(input.base64, "base64");
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(`${input.fileUuid}.pdf`, fileBuffer, {
          // contentType: "application/pdf",
          // upsert: true,
        });

      if (uploadError) throw new Error(uploadError.message);

      const fileUrl =
        supabase.storage.from("uploads").getPublicUrl(`${input.fileUuid}.pdf`)
          .data.publicUrl ?? "";

      await db.file.create({
        data: {
          userId,
          fileName: input.fileName,
          fileUuid: input.fileUuid,
          fileUrl,
          isProcessed: false,
        },
      });

      // TODO: PROCESS PDF FILE
      return { success: true };
    }),

  getCurrentFile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return db.file.findFirst({
      where: { userId },
      orderBy: { uploadedAt: "desc" },
    });
  }),
});
