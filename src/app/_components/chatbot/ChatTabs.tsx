"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ChatArea from "./ChatArea";
import Flashcards from "./Flashcards";
import { TooltipProvider } from "~/components/ui/tooltip";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

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
      <div className="flex h-full w-full items-center justify-center bg-gray-100 p-2">
        <div className="relative h-[90vh] w-full rounded-xl bg-white shadow-lg">
          <Tabs
            value={tabValue}
            onValueChange={(value) => setTabValue(value)}
            className="flex h-full flex-col"
          >
            {/* Tabs Header */}
            <TabsList className="flex w-full justify-around border-b border-gray-300 bg-gray-100 px-4 py-2">
              <TabsTrigger
                value="chatbot"
                className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              >
                Chatbot
              </TabsTrigger>
              <TabsTrigger
                value="flashcard"
                className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              >
                Flashcard
              </TabsTrigger>
            </TabsList>

            {/* Chat Area */}
            <TabsContent
              value="chatbot"
              className="flex-1 overflow-hidden rounded-b-xl bg-white p-3"
            >
              <ChatArea currentFile={currentFile} history={history} />
            </TabsContent>

            {/* Flashcard Area */}
            <TabsContent
              value="flashcard"
              className="flex-1 overflow-hidden rounded-b-xl bg-white p-4"
            >
              <Flashcards flashcards={flashcards} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}
