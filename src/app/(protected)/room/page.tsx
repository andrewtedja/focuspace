"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";
const page = () => {
  return (
    <div>
      <Button
        onClick={async () => {
          try {
            await signOut();
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default page;
