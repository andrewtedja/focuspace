"use client";

import React, { useState } from "react";
import TodoList from "./TodoList";

const TestPage = () => {
  const [showTodoList, setShowTodoList] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List Test Page</h1>
      <button 
        onClick={() => setShowTodoList(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Todo List
      </button>
      <TodoList 
        show={showTodoList} 
        onClose={() => setShowTodoList(false)} 
      />
    </div>
  );
};

export default TestPage;