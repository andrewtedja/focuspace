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
    <li className="flex items-start p-2 rounded-md mb-2 w-full">
      <div className="flex min-w-0 flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggleComplete}
          className="mr-2 mt-1 h-4 w-4 flex-shrink-0 border border-gray-300 rounded"
        />
        <span 
          className={`${
            todo.completed ? "line-through text-gray-400" : "text-white-800"
          } break-all overflow-hidden pr-2`}
        >
          {todo.text}
        </span>
      </div>
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0 ml-1"
        aria-label="Delete todo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </li>
  );
};

export default TodoItem;