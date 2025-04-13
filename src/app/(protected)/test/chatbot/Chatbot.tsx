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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ReactFlipCard from "reactjs-flip-card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
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
import { CircleFadingPlus } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Exo_2 } from "next/font/google";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.worker.min.mjs";

const Chatbot = () => {
  const [tabValue, setTabValue] = useState("chatbot");
  const [input, setInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFileData, setUploadedFileData] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<
    { question: string; answer: string }[]
  >([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showScrollButton, setShowScrollButton] = useState(false);

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

  const generate = api.openai.getFlashcards.useMutation({
    onSuccess: (data) => {
      setFlashcards(data);
      toast("Flashcards Generated!");
      setIsGenerating(false);
    },
    onError: () => {
      toast.error("Something went wrong when generating flashcards!");
      setIsGenerating(false);
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
      toast.error("Something went wrong. Please try again.");
    }
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const allMessages = [...(history ?? [])];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setShowScrollButton(!entry.isIntersecting);
        }
      },
      {
        root: document.querySelector(".scroll-area-viewport") || null,
        threshold: 1.0,
      },
    );

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => {
      if (scrollRef.current) {
        observer.unobserve(scrollRef.current);
      }
    };
  }, []);

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

      const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
      const pdfDocument = await loadingTask.promise;
      console.log("PDF loaded. Number of pages:", pdfDocument.numPages);

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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error during client-side PDF processing:", err);
      toast.error("Error during client-side PDF processing: " + errorMessage);
    }
  };

  return (
    <Tabs
      value={tabValue}
      onValueChange={(value) => setTabValue(value)}
      className="flex h-full max-h-full w-fit flex-col"
    >
      <TooltipProvider>
        <TabsList className="flex h-fit w-full bg-gray-600">
          <TabsTrigger value="chatbot" className="flex-1 text-white">
            Chatbot
          </TabsTrigger>
          <TabsTrigger value="flashcard" className="flex-1 text-white">
            Flashcard
          </TabsTrigger>
        </TabsList>
        <div
          className={`mt-0 h-[95vh] w-fit flex-1 ${
            tabValue === "chatbot" ? "" : "hidden"
          }`}
        >
          <div className="m-0 flex h-full max-h-full w-fit flex-col">
            <ScrollArea className="h-full w-fit flex-1 overflow-y-auto px-4">
              {showScrollButton && (
                <Button
                  className="absolute bottom-5 left-1/2 z-10 h-10 w-10 -translate-x-1/2 rounded-full opacity-75"
                  onClick={() => {
                    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <ChevronDown />
                </Button>
              )}
              <div className="flex h-full w-96 flex-col-reverse space-y-2 py-2">
                <div ref={scrollRef} />
                {allMessages.map((msg, idx) => (
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
                        <span>
                          {currentFile?.fileUuid ? "Update" : "Upload"}
                        </span>
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
        </div>
        <TabsContent
          value="flashcard"
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  generate.mutate();
                  setIsGenerating(true);
                }}
                disabled={isGenerating}
                className="absolute bottom-5 right-5 z-40 h-10 w-10 rounded-full"
              >
                <CircleFadingPlus></CircleFadingPlus>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="rounded-md bg-white p-2 text-sm">
                Generate flashcards
              </p>
            </TooltipContent>
          </Tooltip>
          <div className="flex w-full items-center justify-center px-4">
            <Carousel
              orientation="vertical"
              className="h-fit w-96"
              opts={{ align: "start" }}
            >
              <CarouselContent className="h-[300px] w-full">
                {flashcards.map((card, index) => (
                  <CarouselItem
                    key={index}
                    className="flex h-fit w-full items-center justify-center"
                  >
                    <ReactFlipCard
                      frontComponent={
                        <Card className="h-full w-full bg-gray-700">
                          <CardHeader className="h-full">
                            <CardTitle className="text-white">
                              Question
                            </CardTitle>
                            <CardDescription className="flex h-full items-center justify-center text-center text-white">
                              {card.question}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      }
                      backComponent={
                        <Card className="h-full w-full bg-gray-500">
                          <CardHeader className="h-full">
                            <CardTitle>Answer</CardTitle>
                            <CardDescription className="flex h-full items-center justify-center text-center text-white">
                              {card.answer}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      }
                      flipTrigger="onClick"
                      direction="vertical"
                      containerCss="w-full h-fit"
                      flipCardCss="w-full h-fit"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {flashcards.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          </div>
        </TabsContent>
      </TooltipProvider>
    </Tabs>
  );
};

export default Chatbot;
