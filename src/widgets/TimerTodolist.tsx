import React from "react";
import TodolistComponent from "~/app/_components/TodoList/TodolistComponent";

export default function TimerTodolist({ content }: { content?: string }) {
  return (
    <div className="relative min-h-[200px] overflow-hidden">
      <TodolistComponent />
    </div>
  );
}
