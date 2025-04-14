"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { ChevronDown } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

import { toast } from "sonner";
import { File } from "lucide-react";

import { api } from "~/trpc/react";
import type {
  PDFDocumentLoadingTask,
  TextContent,
  TextItem,
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/types/src/display/api";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import UploadDialog from "./UploadDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

// pdfjs worker:
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.worker.min.mjs";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
type RouterOutput = inferRouterOutputs<AppRouter>;
type CurrentFile = RouterOutput["pdfUpload"]["getCurrentFile"];
type History = RouterOutput["message"]["getRecentMessages"];
type ChatAreaProps = {
  history: History;
  currentFile: CurrentFile;
};

/**
 * The chat area containing the messages and the input (plus upload dialog).
 * This replicates the logic from the original “Chatbot” code for the chat portion.
 */
export default function ChatArea({ history, currentFile }: ChatAreaProps) {
  // For storing the user’s text input
  const [input, setInput] = useState("");

  // For showing/hiding the scroll-to-bottom button
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // For PDF uploading
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadedFileData, setUploadedFileData] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pdfMode, SetPdfMode] = useState(true);

  // tRPC hooks
  const utils = api.useUtils();

  const saveMessage = api.message.saveMessage.useMutation();
  const getAnswer = api.openai.askQuestion.useMutation();

  const upload = api.pdfUpload.uploadAndReplacePdf.useMutation({
    onSuccess: async () => {
      await utils.pdfUpload.getCurrentFile.invalidate();
      toast("PDF uploaded successfully!");

      await handleProcessClient();
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

  /**
   * Handle sending a message to the chat.
   */
  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;
    setInput("");

    try {
      // Save user message
      await saveMessage.mutateAsync({ sender: "user", content: question });
      await utils.message.getRecentMessages.invalidate();

      // Ask model for answer
      const { answer } = await getAnswer.mutateAsync({ question, pdfMode });

      // Save bot response
      await saveMessage.mutateAsync({ sender: "bot", content: answer });
      await utils.message.getRecentMessages.invalidate();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  /**
   * Handle selecting and uploading a PDF file.
   */
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

  /**
   * Process the uploaded PDF client-side (extract text, etc.).
   */
  const handleProcessClient = async () => {
    if (!uploadedFileData) {
      toast.error("No uploaded file available for processing.");
      return;
    }
    try {
      const binaryString = atob(uploadedFileData);
      const len = binaryString.length;
      const uint8Array = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      const loadingTask: PDFDocumentLoadingTask = pdfjsLib.getDocument({
        data: uint8Array,
      });
      const pdfDocument: PDFDocumentProxy = await loadingTask.promise;

      console.log("PDF loaded. Number of pages:", pdfDocument.numPages);

      let rawText = "";
      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page: PDFPageProxy = await pdfDocument.getPage(pageNum);
        const textContent: TextContent = await page.getTextContent();
        const pageText = (textContent.items as TextItem[])
          .map((item: { str: string }) => item.str)
          .join(" ");
        rawText += pageText + "\n";
      }
      console.log("Extracted text length:", rawText.length);

      processClient.mutate({ rawText });
      toast("PDF processed successfully.");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error during client-side PDF processing:", err);
      toast.error("Error during client-side PDF processing: " + errorMessage);
    }
  };

  /**
   * Scroll to the bottom whenever new messages come in.
   */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  /**
   * IntersectionObserver to detect whether the bottom is visible
   * and toggle the scroll-to-bottom button.
   */
  useEffect(() => {
    const node = scrollRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the entry is not fully visible, show the scroll button
        if (entry) {
          setShowScrollButton(!entry.isIntersecting);
        }
      },
      {
        root: document.querySelector(".scroll-area-viewport") ?? null,
        threshold: 1.0,
      },
    );

    if (node) {
      observer.observe(node);
    }
    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  /**
   * Gather all messages from the API.
   */
  const allMessages = Array.isArray(history) ? history : [];

  // Determine if the bot is currently "sending" (saving messages or answering).
  const isSending = saveMessage.isPending || getAnswer.isPending;

  return (
    <div className="m-0 flex h-full w-full flex-col items-center justify-center bg-[#f7f4f7]">
      {/* Scrollable area for chat messages */}
      <ScrollArea className="h-full w-full flex-1 overflow-y-auto p-3">
        {showScrollButton && (
          <Button
            className="absolute bottom-5 left-1/2 z-10 h-10 w-10 -translate-x-1/2 rounded-full opacity-75"
            onClick={() =>
              scrollRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <ChevronDown />
          </Button>
        )}

        {/* The list of messages */}
        <MessageList messages={allMessages} scrollRef={scrollRef} />
      </ScrollArea>

      {/* Bottom area: PDF upload + message input */}
      <div className="flex w-full items-center gap-2 border-t bg-[#f0f1f0] px-2 py-4">
        {/* PDF Upload (AlertDialog inside) */}
        <UploadDialog
          currentFile={currentFile}
          isUploading={isUploading}
          fileRef={fileRef}
          handleUpload={handleUpload}
        ></UploadDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => SetPdfMode(!pdfMode)}
              aria-label="Toggle PDF mode"
              className={`inline-flex h-12 min-w-12 items-center justify-center rounded-md border px-2 text-sm font-medium transition-colors ${
                pdfMode
                  ? "border-input bg-white text-accent-foreground"
                  : "border-transparent bg-[#151515] text-sky-300"
              }`}
            >
              <File className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {pdfMode ? "Turn off PDF context" : "Turn on PDF context"}
          </TooltipContent>
        </Tooltip>

        {/* Text input + send button. This reuses the MessageInput component */}
        <MessageInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          isSending={isSending}
        />
      </div>
    </div>
  );
}
