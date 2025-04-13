"use client";
import { PropsWithChildren } from "react";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import ChatTabs from "./ChatTabs";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { api } from "~/trpc/react";
import { Sparkles, SparklesIcon } from "lucide-react";
const AiBuddy: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: history } = api.message.getRecentMessages.useQuery();
  const { data: currentFile } = api.pdfUpload.getCurrentFile.useQuery();
  const { data: flashcards } = api.flashcard.getFlashcardsByUser.useQuery();
  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {children}
        <SheetTrigger asChild>
          <Button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-16 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#86B3D1] to-[#95BAAA] text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 hover:shadow-lg hover:shadow-[#8abce5] active:scale-95"
          >
            <SparklesIcon className="h-5 w-5 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent forceMount className="p-0">
          <VisuallyHidden>
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
          </VisuallyHidden>
          <ChatTabs
            history={history ?? []}
            currentFile={currentFile ?? null}
            flashcards={flashcards ?? []}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AiBuddy;
