"use client";

import React, { useState } from "react";
import { Rnd } from "react-rnd";
import TodoItem from "./TodoItem";

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
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [size, setSize] = useState({ width: 320, height: 400 });

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem: Todo = {
        id: Date.now(),
        text: newTodo,
        completed: false
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo("");
    }
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodoComplete = (id: number) => {
    setTodos(todos.map((todo) => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Rnd
        size={{ width: size.width, height: size.height }}
        position={{ x: window.innerWidth / 2 - size.width / 2, y: window.innerHeight / 2 - size.height / 2 }}
        onResize={(e, direction, ref, delta, position) => {
          setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight
          });
        }}
        minWidth={240}
        minHeight={300}
        bounds="window"
        className="bg-blue-900 text-white rounded-lg overflow-hidden"
      >
        <div className="p-6 h-full flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-yellow-300 hover:text-yellow-500"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-4">To-do List</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task"
              className="border rounded px-2 py-1 flex-1 text-black"
            />
            <button
              onClick={addTodo}
              className="bg-yellow-500 text-black px-4 py-1 rounded"
            >
              Add
            </button>
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
        </div>
      </Rnd>
    </div>
  );
};

export default TodoList;