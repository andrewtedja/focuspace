"use client";

import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import TodoItem from "./TodoItem";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
    // Load todos from localStorage on initial render
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
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
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  if (!show) return null;

  return (
    <Card className="bg-blue-900 text-white border-none rounded-lg h-full">
      <CardHeader className="pb-2 relative">
        <Button
          onClick={onClose}
          variant="ghost"
          className="absolute top-2 right-2 text-yellow-300 hover:text-yellow-500 hover:bg-transparent p-1 h-auto"
        >
          <X size={18} />
        </Button>
        <CardTitle className="text-xl font-bold">To-do List</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-col h-[calc(100%-100px)]">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task"
            className="border rounded px-2 py-1 flex-1 text-black"
          />
          <Button
            onClick={addTodo}
            className="bg-yellow-500 hover:bg-yellow-600 text-black border-0"
          >
            Add
          </Button>
        </div>
        <ul className="space-y-2 overflow-y-auto flex-1">
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