import React, { useState, useEffect, useRef } from "react";
import { Check, Trash2, Clock, List } from "lucide-react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function PomodoroTodoApp() {
  const [activeTab, setActiveTab] = useState<"tasks" | "timer">("timer");

  // Todo list state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoInput, setTodoInput] = useState<string>("");

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [selectedTime, setSelectedTime] = useState<number>(25);

  // Preset
  const timePresets = [
    [10, 15, 25],
    [30, 40, 50],
  ];

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = (): void => {
    setIsRunning(true);
  };

  const pauseTimer = (): void => {
    setIsRunning(false);
  };

  const resetTimer = (): void => {
    setIsRunning(false);
    setTimeLeft(selectedTime * 60);
  };

  const selectTime = (minutes: number): void => {
    setSelectedTime(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const addTodo = (): void => {
    if (todoInput.trim() !== "") {
      const newTodo: Todo = {
        id: Date.now(),
        text: todoInput.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTodoInput("");
    }
  };

  const deleteTodo = (id: number): void => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id: number): void => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-lg text-white shadow-lg backdrop-blur-xl">
      <div className="flex border-b border-gray-700 bg-black/60 backdrop-blur-lg">
        <button
          className={`flex items-center justify-center px-4 py-3 text-lg font-medium ${activeTab === "tasks" ? "border-b-2 border-[#86B3D1] text-[#86B3D1]" : "text-gray-400 hover:text-gray-500"}`}
          onClick={() => setActiveTab("tasks")}
        >
          <List size={16} className="mr-2" />
          Tasks
        </button>
        <button
          className={`flex items-center justify-center px-4 py-3 text-lg font-medium ${activeTab === "timer" ? "border-b-2 border-[#86B3D1] text-[#86B3D1]" : "text-gray-400 hover:text-gray-500"}`}
          onClick={() => setActiveTab("timer")}
        >
          <Clock size={16} className="mr-2" />
          Timer
        </button>
      </div>

      {/* TABS (tasks) */}
      {activeTab === "tasks" && (
        <div className="bg-black/70 p-4 backdrop-blur-2xl">
          <div className="mb-4 flex">
            <input
              type="text"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 rounded-l bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
            <button
              onClick={addTodo}
              className="rounded-r bg-[#5c87a3] p-2 text-white hover:bg-[#48a2df]"
            >
              Add
            </button>
          </div>

          <div className="mt-4 min-h-64 space-y-2">
            {todos.length === 0 ? (
              <p className="py-4 text-center text-gray-200">
                No tasks yet. Add your first task!
              </p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`rounded border p-3 ${todo.completed ? "bg-gray-600" : "bg-gray-700"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleComplete(todo.id)}
                        className={`mt-0 flex h-5 w-5 items-center justify-center rounded-full border ${todo.completed ? "border-green-500 bg-green-500 text-white" : "border-gray-500"}`}
                      >
                        {todo.completed && <Check size={12} />}
                      </button>
                      <p
                        className={`${todo.completed ? "text-gray-400 line-through" : "text-gray-200"}`}
                      >
                        {todo.text}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TABS */}
      {activeTab === "timer" && (
        <div className="bg-black/70 p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-center">
            <Clock className="mr-2" size={20} />
            <h2 className="text-xl font-semibold text-gray-50">Pomodoro</h2>
          </div>

          <div className="mb-8 text-center text-6xl font-bold text-[#c2d3d3]">
            {formatTime(timeLeft)}
          </div>

          <div className="mb-8 flex justify-center space-x-4">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="bg-[#4677a1] px-4 py-2 text-white shadow-md hover:bg-[#4987bc]"
              >
                Start
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="bg-[#4677a1] px-4 py-2 text-white shadow-md hover:bg-[#4987bc]"
              >
                Pause
              </button>
            )}
            <button
              onClick={resetTimer}
              className="bg-gray-500 px-4 py-2 text-white shadow-md hover:bg-gray-600"
            >
              Reset
            </button>
          </div>

          {/* Time  Grid */}
          <div className="space-y-2">
            <p className="mb-2 text-sm font-medium text-gray-700"></p>
            <div className="grid grid-cols-3 gap-2">
              {timePresets.flat().map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => selectTime(minutes)}
                  className={`rounded-md px-2 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedTime === minutes
                      ? "bg-[#6297b9] text-white"
                      : "bg-[#b7c6d1] text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
