"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { CheckCircle, CircleFadingPlus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import ReactFlipCard from "reactjs-flip-card";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
type RouterOutput = inferRouterOutputs<AppRouter>;
type Flashcard = RouterOutput["flashcard"]["getFlashcardsByUser"];

type FlashcardProps = {
  flashcards: Flashcard;
};
/**
 * Displays and generates the flashcards, mirroring the logic used in the Chatbot component.
 */
export default function Flashcards({ flashcards }: FlashcardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const util = api.useUtils();
  const generate = api.openai.getFlashcards.useMutation({
    onSuccess: async () => {
      await util.flashcard.getFlashcardsByUser.invalidate();
      toast("Flashcards Generated!");
      setIsGenerating(false);
    },
    onError: () => {
      toast.error("Something went wrong when generating flashcards!");
      setIsGenerating(false);
    },
  });

  const handleGenerateFlashcards = () => {
    setIsGenerating(true);
    generate.mutate();
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleGenerateFlashcards}
            disabled={isGenerating}
            className="absolute bottom-5 right-5 z-40 h-16 w-16 rounded-full"
          >
            <CircleFadingPlus></CircleFadingPlus>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="rounded-md p-2 text-sm text-white">
            Generate new flashcards
          </p>
        </TooltipContent>
      </Tooltip>
      <div className="flex w-full items-center justify-center px-2">
        <Carousel
          orientation="vertical"
          className="h-fit w-96"
          opts={{ align: "start" }}
        >
          <CarouselContent className="h-[300px] w-full">
            {flashcards.map((card, index) => (
              <CarouselItem
                key={index}
                className="flex w-full cursor-pointer items-center justify-center"
              >
                <ReactFlipCard
                  frontComponent={
                    <Card className="h-full w-full bg-gradient-to-b from-gray-700 to-gray-800 transition-all duration-200 hover:shadow-2xl">
                      <CardHeader className="h-full">
                        <CardTitle className="text-xl text-white">
                          Question
                        </CardTitle>
                        <CardDescription className="flex h-full items-center justify-center text-center text-white">
                          {card.question}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  }
                  backComponent={
                    <Card className="h-full w-full rounded-xl border-2 border-black bg-gradient-to-b from-[#f1f0f1] to-white shadow-md transition-transform duration-200 hover:scale-[1.01]">
                      <CardHeader className="flex h-full flex-col justify-between gap-4 p-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <CardTitle className="text-lg font-bold text-gray-800">
                            Answer
                          </CardTitle>
                        </div>
                        <CardDescription className="flex flex-1 items-center justify-center px-2 text-center text-base text-gray-700">
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
    </div>
  );
}
