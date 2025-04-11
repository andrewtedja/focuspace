"use client";

import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  show: boolean;
  onClose: () => void;
}

const TodoList: React.FC<TodoListProps> = ({ show, onClose }) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      const savedTodos = localStorage.getItem("todos");
      return savedTodos ? (JSON.parse(savedTodos) as Todo[]) : [];
    }
    return [];
  });
  const [newTodo, setNewTodo] = useState("");
  const [size, setSize] = useState({ width: 450, height: 400 });

  useEffect(() => {
    // Save todos to localStorage whenever they change
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem: Todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo("");
    }
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodoComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  if (!show) return null;

  return (
    <Card className="h-full rounded-lg border-none bg-blue-900 text-white">
      <CardHeader className="relative pb-2">
        <Button
          onClick={onClose}
          variant="ghost"
          className="absolute right-2 top-2 h-auto p-1 text-yellow-300 hover:bg-transparent hover:text-yellow-500"
        >
          <X size={18} />
        </Button>
        <CardTitle className="text-xl font-bold">To-do List</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[calc(100%-100px)] flex-col p-4">
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new task"
            className="flex-1 rounded border px-2 py-1 text-black"
          />
          <Button
            onClick={addTodo}
            className="border-0 bg-yellow-500 text-black hover:bg-yellow-600"
          >
            Add
          </Button>
        </div>
        <ul className="flex-1 space-y-2 overflow-y-auto">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onRemove={() => removeTodo(todo.id)}
              onToggleComplete={() => toggleTodoComplete(todo.id)}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TodoList;
