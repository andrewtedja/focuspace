import React from "react";
import Chatbot from "./Chatbot";
import ProtectedRoute from "~/app/_components/routes/protectedRoute";
const page = () => {
  return (
    <ProtectedRoute>
      <div className="flex h-full w-full justify-center">
        <div className="relative h-screen max-h-screen bg-gray-400">
          <Chatbot></Chatbot>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default page;
