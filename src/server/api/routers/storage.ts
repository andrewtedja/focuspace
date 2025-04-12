import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { createSupabaseServerClient } from "~/server/supabase";

export const storageRouter = createTRPCRouter({
  uploadBase64: publicProcedure
    .input(z.object({ fileName: z.string(), base64: z.string() }))
    .mutation(async ({ input }) => {
      const supabase = await createSupabaseServerClient();

      const fileBuffer = Buffer.from(input.base64, "base64");

      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(input.fileName, fileBuffer);

      if (error) throw new Error(error.message);

      const publicUrl = supabase.storage
        .from("uploads")
        .getPublicUrl(input.fileName).data.publicUrl;

      return publicUrl;
    }),
  getFileByUuid: publicProcedure
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
