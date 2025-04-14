import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { createSupabaseServerClient } from "~/server/supabase";

export const fileUploadRouter = createTRPCRouter({
  /**
   * Upload or replace an existing background/profile/audio file.
   *
   * 1) Looks up the user record from the DB.
   * 2) Identifies any existing UUID for the same file type (bg, image, or music).
   * 3) Removes the old file from Supabase Storage (if found).
   * 4) Uploads the new file and updates user record with the new URL + UUID.
   */
  uploadAndReplaceFile: protectedProcedure
    .input(
      z.object({
        fileName: z.string(), // e.g. "myphoto.png"
        fileUuid: z.string(), // new random ID for your file
        base64: z.string(), // raw base64 (no "data:...base64," prefix)
        fileType: z.enum(["background", "profile", "audio"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) throw new Error("User not authenticated");

      const supabase = await createSupabaseServerClient();

      // 1) Look up user record
      const userRecord = await db.user.findUnique({ where: { id: userId } });
      if (!userRecord) throw new Error("User not found");

      // 2) Determine old UUID field + new DB fields
      let oldUuid: string | null = null;
      const updateData: Record<string, unknown> = {};

      if (input.fileType === "background") {
        oldUuid = userRecord.bgUuid;
      } else if (input.fileType === "profile") {
        oldUuid = userRecord.imageUuid;
      } else if (input.fileType === "audio") {
        oldUuid = userRecord.musicUuid;
      }

      // 3) If there's an old file, remove it from Supabase
      if (oldUuid) {
        // We "search" for the old file by listing objects whose names contain the oldUuid
        // This is necessary if you don't store the extension or full filename in the DB
        const { data: listData, error: listError } = await supabase.storage
          .from("uploads")
          .list("", { search: oldUuid });

        if (listError) {
          console.warn("Could not list old file:", listError.message);
        } else if (listData?.length) {
          const fileToRemove = listData.find((f) => f.name.includes(oldUuid));
          if (fileToRemove) {
            const { error: removeError } = await supabase.storage
              .from("uploads")
              .remove([fileToRemove.name]);
            if (removeError) {
              console.warn("Could not remove old file:", removeError.message);
              // decide if you want to continue or throw an error
            }
          }
        }
      }

      // 4) Prepare new file data and upload
      const extension = input.fileName.split(".").pop()?.toLowerCase() ?? "";
      const fileBuffer = Buffer.from(input.base64, "base64");
      const newFilename = `${input.fileUuid}.${extension}`;

      // Content type is optional if Supabase can detect it,
      // but to be safe, you can set e.g. `image/png` or `audio/mpeg` dynamically
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(newFilename, fileBuffer /*, { contentType } */);

      if (uploadError) throw new Error(uploadError.message);

      // 5) Generate public URL
      const publicUrl =
        supabase.storage.from("uploads").getPublicUrl(newFilename).data
          .publicUrl ?? "";

      // 6) Build update data based on fileType
      if (input.fileType === "background") {
        updateData.bg = publicUrl;
        updateData.bgUuid = input.fileUuid;
      } else if (input.fileType === "profile") {
        updateData.image = publicUrl;
        updateData.imageUuid = input.fileUuid;
      } else if (input.fileType === "audio") {
        updateData.music = publicUrl;
        updateData.musicUuid = input.fileUuid;
        updateData.musicName = input.fileName; // keep original name if you like
      }

      // 7) Update user record in DB
      await db.user.update({
        where: { id: userId },
        data: updateData,
      });

      // 8) Return success
      return { success: true, publicUrl, uuid: input.fileUuid };
    }),

  /**
   * Optionally, you can create separate queries to fetch
   * the user's current background/audio/profile if you need them,
   * but typically you might have a getUserById or similar.
   */
  getUserFiles: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    if (!userId) throw new Error("Not authenticated");

    return db.user.findUnique({
      where: { id: userId },
      select: {
        bg: true,
        bgUuid: true,
        image: true,
        imageUuid: true,
        music: true,
        musicUuid: true,
        musicName: true,
      },
    });
  }),
});
