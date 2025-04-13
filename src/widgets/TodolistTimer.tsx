import React from "react";
import TodolistTimer from "~/app/_components/TodolistTimer/TodolistTimer";

export default function TimerTodolist({ content }: { content?: string }) {
  return (
    <div className="relative min-h-[200px] overflow-hidden">
      <TodolistTimer />
    </div>
  );
}
