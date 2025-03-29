"use client";

import React, { useState } from "react";
import TodoList from "./TodoList";

const TodolistComponent = () => {
  const [showTodoList, setShowTodoList] = useState(true);
  return (
      <TodoList 
        show={showTodoList} 
        onClose={() => setShowTodoList(false)} 
      />
  );
};

export default TodolistComponent;