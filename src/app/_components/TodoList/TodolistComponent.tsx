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
    <div className="mx-auto flex h-full w-full flex-col overflow-hidden rounded-lg text-white shadow-lg backdrop-blur-xl">
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
        <div className="bg-black/70 p-6 backdrop-blur-2xl">
          <div className="mb-6">
            <div className="flex overflow-hidden rounded-lg border border-gray-600/30 bg-gray-800/50 shadow-lg">
              <input
                type="text"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                placeholder="Add a new task..."
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
              />
              <button
                onClick={addTodo}
                className="bg-[#5c87a3] px-6 py-3 font-medium text-white transition-all hover:bg-[#48a2df] active:scale-95"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-4 min-h-64 space-y-3">
            {todos.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-gray-600/30 bg-gray-800/20">
                <p className="text-center text-gray-400">
                  No tasks yet. Add your first task!
                </p>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`group transform rounded-lg border border-gray-600/30 bg-gray-800/50 p-2 transition-all hover:border-gray-500/50 ${
                    todo.completed ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleComplete(todo.id)}
                        className={`transform rounded-full border-2 p-1 transition-all hover:scale-110 ${
                          todo.completed
                            ? "border-green-500 bg-green-500/20 text-green-500"
                            : "border-gray-500 hover:border-green-500 hover:text-green-500"
                        }`}
                      >
                        {todo.completed && <Check size={12} />}
                      </button>
                      <p
                        className={`transition-all ${
                          todo.completed
                            ? "text-gray-500 line-through"
                            : "text-gray-200"
                        }`}
                      >
                        {todo.text}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="transform p-2 text-gray-500 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
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
        <div className="bg-black/70 p-8 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-center">
            <Clock className="mr-2" size={16} />
            <h2 className="text-lg font-semibold text-gray-50">
              Pomodoro Focus
            </h2>
          </div>

          <div className="mb-8 text-center">
            <div className="text-8xl font-light tracking-tight text-[#e2f0f0]">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="mb-8 flex justify-center space-x-4">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="transform rounded-lg bg-[#5c87a3] px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-[#48a2df] hover:shadow-xl active:scale-95"
              >
                Start Focus
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="transform rounded-lg bg-[#4677a1] px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-[#4987bc] hover:shadow-xl active:scale-95"
              >
                Pause
              </button>
            )}
            <button
              onClick={resetTimer}
              className="transform rounded-lg bg-gray-600/50 px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-gray-500 hover:shadow-xl active:scale-95"
            >
              Reset
            </button>
          </div>

          {/* Time Presets */}
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-center text-sm font-medium text-gray-400">
              Quick Presets
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {timePresets.flat().map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => selectTime(minutes)}
                  className={`transform rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    selectedTime === minutes
                      ? "bg-[#6297b9] text-white shadow-lg"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
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
