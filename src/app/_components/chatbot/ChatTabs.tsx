"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ChatArea from "./ChatArea";
import Flashcards from "./Flashcards";
import { TooltipProvider } from "~/components/ui/tooltip";
/**
 * Top-level component for switching between Chatbot and Flashcard tabs
 */

import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
type RouterOutput = inferRouterOutputs<AppRouter>;
type Flashcard = RouterOutput["flashcard"]["getFlashcardsByUser"];
type CurrentFile = RouterOutput["pdfUpload"]["getCurrentFile"];
type History = RouterOutput["message"]["getRecentMessages"];
type ChatTabsProps = {
  history: History;
  currentFile: CurrentFile;
  flashcards: Flashcard;
};
export default function ChatTabs({
  history,
  currentFile,
  flashcards,
}: ChatTabsProps) {
  const [tabValue, setTabValue] = useState("chatbot");

  return (
    <TooltipProvider>
      <div className="flex h-full w-full justify-center">
        <div className="relative h-screen max-h-screen rounded-lg bg-gray-400">
          <Tabs
            value={tabValue}
            onValueChange={(value) => setTabValue(value)}
            className="flex h-full max-h-full w-fit flex-col"
          >
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
              <ChatArea currentFile={currentFile} history={history} />
            </div>

            <div
              className={`mt-0 h-[95vh] w-fit flex-1 ${
                tabValue === "flashcard" ? "" : "hidden"
              }`}
            >
              <Flashcards flashcards={flashcards} />
            </div>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}
