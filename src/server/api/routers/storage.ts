import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { createSupabaseServerClient } from "~/server/supabase";
import { randomUUID } from "crypto";
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

      // Convert base64 to Buffer
      const fileBuffer = Buffer.from(input.base64, "base64");

      // Generate a unique file name
      const uuid = randomUUID();
      const extension = input.fileName.split(".").pop()?.toLowerCase() || "";

      const fileNameWithUuid = `${uuid}.${extension}`;

      // Extract extension

      // Dynamically set content type based on type + file extension
      let contentType: string;

      // If audio:
      if (input.type === "audio") {
        switch (extension) {
          case "mp3":
            contentType = "audio/mpeg";
            break;
          case "wav":
            contentType = "audio/wav";
            break;
          case "ogg":
            contentType = "audio/ogg";
            break;
          case "aac":
            contentType = "audio/aac";
            break;
          // Add other audio extensions as needed
          default:
            contentType = "audio/mpeg"; // Fallback
            break;
        }
      } else {
        // Otherwise, treat as image
        switch (extension) {
          case "png":
            contentType = "image/png";
            break;
          case "jpg":
          case "jpeg":
            contentType = "image/jpeg";
            break;
          case "gif":
            contentType = "image/gif";
            break;
          // Add other image extensions as needed
          default:
            contentType = "image/jpeg"; // Fallback
            break;
        }
      }

      // Upload to Supabase Storage with specified content type
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(fileNameWithUuid, fileBuffer, {
          contentType,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Retrieve the public URL
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

      if (updateError) {
        throw new Error(updateError.message);
      }

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
