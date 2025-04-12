"use client";

import { api } from "~/trpc/react";
import { useRef, useState } from "react";
import ProtectedRoute from "~/app/_components/routes/protectedRoute";

export default function FileUpload() {
  const [url, setUrl] = useState<string | null>(null);
  const [isPDF, setIsPDF] = useState(false); // 🆕 Add PDF flag
  const upload = api.storage.uploadBase64.useMutation();

  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setIsPDF(file.type === "application/pdf");

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string | null;
      if (!result) return;
      const base64 = result.split(",")[1];
      const uuid = crypto.randomUUID();
      if (!base64) return;
      upload.mutate(
        {
          fileName: uuid,
          base64,
        },
        {
          onSuccess: (url) => {
            setUrl(url);
          },
          onError: (err) => {
            console.error("Upload failed", err);
          },
        },
      );
    };
    reader.readAsDataURL(file);
  };

  return (
    <ProtectedRoute>
      <div className="p-4">
        <input type="file" ref={fileRef} accept="application/pdf,image/*" />
        <button
          className="ml-2 rounded bg-green-600 px-4 py-2 text-white"
          onClick={handleUpload}
        >
          Upload
        </button>

        {url && (
          <div className="mt-4">
            {isPDF ? (
              <iframe
                src={url}
                className="h-96 w-full rounded border"
                title="PDF Preview"
              />
            ) : (
              <p>
                ✅ Uploaded!{" "}
                <a
                  href={url}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  View File
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
