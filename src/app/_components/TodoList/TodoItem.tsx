"use client";

import React from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onRemove: () => void;
  onToggleComplete: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onRemove, onToggleComplete }) => {
  return (
    <li className="flex justify-between items-center border rounded px-2 py-1">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggleComplete}
          className="mr-2"
        />
        <span className={todo.completed ? "line-through text-gray-400" : ""}>
          {todo.text}
        </span>
      </div>
      <button
        onClick={onRemove}
        className="text-red-500 hover:underline"
      >
        Remove
      </button>
    </li>
  );
};

export default TodoItem;