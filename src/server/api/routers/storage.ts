import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { createSupabaseServerClient } from "~/server/supabase";
import { randomUUID } from "crypto"; // for generating file UUID
import { Prisma } from "@prisma/client";

export const storageRouter = createTRPCRouter({
  uploadBase64: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        base64: z.string(),
        type: z.enum(["background", "profile", "audio"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const supabase = await createSupabaseServerClient();

      const fileBuffer = Buffer.from(input.base64, "base64");

      const uuid = randomUUID(); // generate a unique UUID
      const fileNameWithUuid = `${uuid}_${input.fileName}`;

      // Determine content type based on file type
      let contentType: string;
      if (input.type === "audio") {
        contentType = "audio/mpeg"; // Adjust as needed for different audio formats
      } else {
        contentType = "image/jpeg"; // Adjust as needed for different image formats
      }

      // Upload to Supabase Storage with specified content type
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(fileNameWithUuid, fileBuffer, {
          contentType,
        });

      if (uploadError) throw new Error(uploadError.message);

      const publicUrl = supabase.storage
        .from("uploads")
        .getPublicUrl(fileNameWithUuid).data.publicUrl;

      // Update the appropriate field in the User model based on type
      let updateData: Prisma.UserUpdateInput = {};
      if (input.type === "profile") {
        updateData = {
          image: publicUrl,
          imageUuid: uuid,
        };
      } else if (input.type === "audio") {
        updateData = {
          music: publicUrl,
          musicUuid: uuid,
          musicName: input.fileName,
        };
      } else if (input.type === "background") {
        updateData = {
          bg: publicUrl,
          bgUuid: uuid,
        };
      }

      // Update user in the database
      const { error: updateError } = await supabase
        .from("User")
        .update(updateData)
        .eq("id", userId);

      if (updateError) throw new Error(updateError.message);

      return { url: publicUrl, uuid };
    }),

  getFileByUuid: protectedProcedure
    .input(z.object({ uuid: z.string() }))
    .query(async ({ input }) => {
      const supabase = await createSupabaseServerClient();

      const { data, error } = await supabase.storage
        .from("uploads")
        .list("", { search: input.uuid });

      if (error) throw new Error(error.message);

      const file = data?.find((f) => f.name.includes(input.uuid));
      if (!file) throw new Error("File not found");

      const publicUrl = supabase.storage.from("uploads").getPublicUrl(file.name)
        .data.publicUrl;

      return { fileName: file.name, url: publicUrl };
    }),
});
