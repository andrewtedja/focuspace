"use client";
import React from "react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import ProtectedRoute from "~/app/_components/routes/protectedRoute";
const page = () => {
  const router = useRouter();
  return (
    <ProtectedRoute>
      <Button
        onClick={() => {
          router.push("/room");
        }}
      >
        Go to room
      </Button>
    </ProtectedRoute>
  );
};

export default page;
