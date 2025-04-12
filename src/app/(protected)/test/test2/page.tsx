"use client";

import { useState, useRef } from "react";
import { api } from "~/trpc/react";
import { v4 as uuidv4 } from "uuid";
import * as pdfjsLib from "pdfjs-dist/build/pdf"; // client version
// Ensure the worker is set up correctly for the browser:
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.worker.min.mjs";

export default function Page() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfText, setPdfText] = useState("");

  // Save the uploaded file data for processing client‑side.
  const [uploadedFileData, setUploadedFileData] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // TRPC mutation to ask a question (unchanged)
  const ask = api.openai.askQuestion.useMutation({
    onSuccess: (data) => {
      setResponse(data.answer);
      setLoading(false);
    },
    onError: (err) => {
      setResponse("Error: " + err.message);
      setLoading(false);
    },
  });

  // TRPC mutation to upload the PDF (if you still want to send the file to the server)
  // If you prefer to only process on client, you might remove this API call.
  const upload = api.pdfUpload.uploadAndReplacePdf.useMutation({
    onSuccess: () => {
      setIsUploading(false);
      alert("PDF uploaded successfully!");
      // Optionally, you can clear the file input after upload.
    },
    onError: (err) => {
      console.error("Upload error:", err);
      setIsUploading(false);
    },
  });

  // Handle the file upload – here we both upload to the server and store the file data locally.
  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setIsUploading(true);

    // Read file as Data URL (base64)
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      // Save the base64 data for client-side processing
      const base64 =
        typeof result === "string" ? (result.split(",")[1] ?? "") : "";
      setUploadedFileData(base64);

      // Optionally, also call your API upload mutation to store the file on your server
      const fileUuid = uuidv4();
      upload.mutate({ fileName: file.name, base64, fileUuid });
    };
    reader.readAsDataURL(file);
  };

  // Process the PDF on the client side
  const handleProcessClient = async () => {
    if (!uploadedFileData) {
      alert("No uploaded file available for processing.");
      return;
    }
    setIsProcessing(true);
    try {
      // Decode base64 into an ArrayBuffer
      const binaryString = atob(uploadedFileData);
      const len = binaryString.length;
      const uint8Array = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      // Load the document using pdfjsLib
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
      const pdfDocument = await loadingTask.promise;
      console.log("PDF loaded. Number of pages:", pdfDocument.numPages);

      // Extract text from all pages
      let rawText = "";
      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        rawText += pageText + "\n";
      }
      console.log("Extracted text length:", rawText.length);
      setPdfText(rawText);
      alert(
        "PDF processed successfully on the client. Check the console for extracted text.",
      );

      // (Optionally, update state or send the extracted text to your TRPC question API.)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error during client-side PDF processing:", err);
      alert("Error during client-side PDF processing: " + errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    ask.mutate({ question });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Ask a Question</h1>

      <div>
        <input type="file" ref={fileRef} accept="application/pdf" />
        <button
          onClick={handleUpload}
          className="ml-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          disabled={isUploading}
        >
          Upload PDF
        </button>
      </div>

      {uploadedFileData && (
        <div className="mt-4">
          <p className="text-green-600">File uploaded successfully.</p>
          <button
            onClick={handleProcessClient}
            className="mt-2 rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
            disabled={isProcessing}
          >
            Process PDF (Client)
          </button>
        </div>
      )}

      {isUploading && <p className="text-yellow-600">Uploading your PDF...</p>}

      {isProcessing && (
        <p className="text-yellow-600">Processing your PDF on the client...</p>
      )}

      <textarea
        className="w-full rounded border p-3"
        rows={5}
        placeholder="Enter your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        onClick={handleSubmit}
        disabled={
          loading || isUploading || isProcessing || question.trim() === ""
        }
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {response && (
        <div className="mt-6 rounded bg-gray-100 p-4">
          <h2 className="mb-2 font-medium">Answer:</h2>
          <p>{response}</p>
        </div>
      )}
      {pdfText && (
        <div className="mt-4 bg-gray-100 p-2">
          <h3 className="font-medium">Extracted PDF Text:</h3>
          <pre className="whitespace-pre-wrap">{pdfText}</pre>
        </div>
      )}
    </div>
  );
}
