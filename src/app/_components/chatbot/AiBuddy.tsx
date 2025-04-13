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
import { Sparkles } from "lucide-react";
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
            className="fixed bottom-5 right-5 h-10 w-10 rounded-full"
          >
            <Sparkles></Sparkles>
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
