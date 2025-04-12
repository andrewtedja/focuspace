"use client";

import { api } from "~/trpc/react";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { BeatLoader } from "react-spinners";
import { Paperclip } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { toast } from "sonner";
import { VisuallyHidden } from "@react-aria/visually-hidden";

import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.worker.min.mjs";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileData, setUploadedFileData] = useState<string | null>(null);

  const utils = api.useUtils();
  const { data: history } = api.message.getRecentMessages.useQuery();
  const { data: currentFile } = api.pdfUpload.getCurrentFile.useQuery();

  const saveMessage = api.message.saveMessage.useMutation();
  const getAnswer = api.openai.askQuestion.useMutation();
  const upload = api.pdfUpload.uploadAndReplacePdf.useMutation({
    onSuccess: async () => {
      await utils.pdfUpload.getCurrentFile.invalidate();
      toast("PDF uploaded successfully!");
      handleProcessClient();
    },
    onError: (err) => {
      console.error("Upload error:", err);
      setIsUploading(false);
    },
  });

  const processClient = api.embedding.processClientText.useMutation({
    onSuccess: () => {
      toast("Embedding and chunking complete!");
      setIsUploading(false);
    },
    onError: (err) => {
      setIsUploading(false);
      console.error("Embedding failed:", err);
      toast.error("Failed to embed PDF.");
    },
  });

  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;
    setInput("");

    try {
      await saveMessage.mutateAsync({ sender: "user", content: question });
      await utils.message.getRecentMessages.invalidate();
      const { answer } = await getAnswer.mutateAsync({ question });
      await saveMessage.mutateAsync({ sender: "bot", content: answer });
      await utils.message.getRecentMessages.invalidate();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const allMessages = [...(history ?? [])];

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      const base64 =
        typeof result === "string" ? (result.split(",")[1] ?? "") : "";
      setUploadedFileData(base64);
      const fileUuid = uuidv4();
      upload.mutate({ fileName: file.name, base64, fileUuid });
    };
    reader.readAsDataURL(file);
  };

  const handleProcessClient = async () => {
    if (!uploadedFileData) {
      alert("No uploaded file available for processing.");
      return;
    }
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
      processClient.mutate({ rawText });
      toast("PDF processed successfully.");

      // (Optionally, update state or send the extracted text to your TRPC question API.)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error during client-side PDF processing:", err);
      alert("Error during client-side PDF processing: " + errorMessage);
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <ScrollArea className="h-full w-full flex-1 overflow-y-auto px-4 py-2">
        <div className="flex h-full w-[350px] flex-col space-y-2">
          {allMessages.reverse().map((msg, idx) => (
            <div
              key={msg.id + idx}
              className={`w-fit max-w-[75%] break-words rounded-xl p-2 ${
                msg.sender === "user"
                  ? "ml-auto bg-gray-500 text-white"
                  : "mr-auto bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="flex gap-2 bg-gray-500 p-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>
              <Paperclip></Paperclip>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-fit">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {currentFile?.fileUuid ? "Update" : "Upload"} a PDF
              </AlertDialogTitle>
              <div className="space-y-2"></div>
              <Input type="file" ref={fileRef} accept="application/pdf" />
              {currentFile?.fileName && (
                <p className="text-sm text-gray-600">
                  Current file: <strong>{currentFile.fileName}</strong>
                </p>
              )}
              <VisuallyHidden>
                <AlertDialogDescription>
                  oops you found tehee~
                </AlertDialogDescription>
              </VisuallyHidden>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Back</AlertDialogCancel>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <BeatLoader
                    color="black"
                    speedMultiplier={0.7}
                    size={8}
                    className=""
                  />
                ) : (
                  <span>{currentFile?.fileUuid ? "Update" : "Upload"}</span>
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Input
          className="flex-1 rounded border bg-white px-4 py-2"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          onClick={handleSend}
          className="rounded bg-gray-700 px-4 py-2 text-white disabled:opacity-50"
          disabled={
            !input.trim() || saveMessage.isPending || getAnswer.isPending
          }
        >
          {saveMessage.isPending || getAnswer.isPending ? (
            <BeatLoader
              speedMultiplier={0.7}
              size={8}
              className=""
            ></BeatLoader>
          ) : (
            "Send"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Chatbot;
