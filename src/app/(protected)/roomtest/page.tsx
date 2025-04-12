import React from "react";
import { MusicPlayer } from "~/app/_components/MusicPlayer/MusicPlayer";
import TodolistComponent from "~/app/_components/TodoList/TodolistComponent";

const page = () => {
  return (
    <div className="flex h-screen w-screen bg-[url('/images/spaces/placeholder/adhd-2.jpg')] bg-cover bg-center">
      <div className="h-full w-full bg-black bg-opacity-50"></div>
      <MusicPlayer />
      {/* <TodolistComponent />  */}
    </div>
  );
};

export default page;
