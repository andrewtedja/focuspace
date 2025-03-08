"use client";
import React from "react";
import { useSessionStore } from "~/stores/useSessionStore";
import { signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import ProtectedRoute from "~/app/_components/routes/protectedRoute";
import GridLayout from "~/app/_components/gridLayout";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

const page = () => {
  const router = useRouter();
  const { user, logout } = useSessionStore();
  return (
    <ProtectedRoute>
      <span className="break-words">session store: {JSON.stringify(user)}</span>
      <br></br>
      <Button
        onClick={async () => {
          try {
            await signOut().then(() => logout());
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Sign Out
      </Button>
      <br></br>
      <Button
        onClick={() => {
          router.push("/settings");
        }}
      >
        Go to settings
      </Button>
      <div className="h-fit w-screen p-20">
        <Carousel className="h-full w-full rounded-md">
          <CarouselContent>
            <CarouselItem>
              <GridLayout></GridLayout>
            </CarouselItem>
            <CarouselItem>
              <GridLayout></GridLayout>
            </CarouselItem>
            <CarouselItem>
              <GridLayout></GridLayout>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </ProtectedRoute>
  );
};

export default page;
