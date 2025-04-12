import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";

interface PomodoroTimerProps {
  show: boolean;  
  onClose: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onClose }) => {
  const [time, setTime] = useState(() => {
    const savedTime = localStorage.getItem("pomodoroTime"); //lovcalstorage
    return savedTime ? parseInt(savedTime, 10) : 25 * 60;
  });
  const [isRunning, setIsRunning] = useState(() => {
    // Load the running state from localStorage
    const savedRunningState = localStorage.getItem("pomodoroIsRunning");
    return savedRunningState === "true";
  });
  const [isEditing, setIsEditing] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [size, setSize] = useState({ width: 450, height: 400 });
  const [lastUpdateTime, setLastUpdateTime] = useState(() => {
    const savedLastUpdateTime = localStorage.getItem("pomodoroLastUpdateTime");
    return savedLastUpdateTime ? parseInt(savedLastUpdateTime, 10) : null;
  });

  useEffect(() => {
    setHours(Math.floor(time / 3600));
    setMinutes(Math.floor((time % 3600) / 60));
    setSeconds(time % 60);
  }, [time]);

  useEffect(() => {
    if (isRunning && lastUpdateTime) {
      const now = Math.floor(Date.now() / 1000);
      const elapsed = now - lastUpdateTime;
      setTime((prevTime) => Math.max(prevTime - elapsed, 0));
    }
  }, [isRunning, lastUpdateTime]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, time]);

  useEffect(() => {
    // Save time and running state to localStorage whenever they change
    localStorage.setItem("pomodoroTime", time.toString());
    localStorage.setItem("pomodoroIsRunning", isRunning.toString());
    if (isRunning) {
      localStorage.setItem("pomodoroLastUpdateTime", Math.floor(Date.now() / 1000).toString());
    } else {
      localStorage.removeItem("pomodoroLastUpdateTime");
    }
  }, [time, isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    setLastUpdateTime(Math.floor(Date.now() / 1000));
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(25 * 60);
    localStorage.removeItem("pomodoroLastUpdateTime");
  };

  const handleTimeClick = () => {
    if (!isRunning) {
      setIsEditing(true);
    }
  };

  const handleTimeUpdate = () => {
    const newTime = hours * 3600 + minutes * 60 + seconds;
    setTime(newTime);
    setIsEditing(false);
  };

  const formatTimeUnit = (unit: number) => unit.toString().padStart(2, "0");

  return (
        <Card 
        className="text-white border-none w-200 rounded-lg" 
        style={{ backgroundColor: '#1e3a8a'}}
        >
            <CardHeader className="relative">
                <Button
                onClick={onClose}
                variant="ghost"
                className="absolute top-2 right-2 text-yellow-300 hover:text-yellow-500 hover:bg-transparent p-1 h-auto"
                >
                <X size={18} />
                </Button>
                <div className="flex justify-center">
                <CardTitle className="bg-yellow-200 text-blue-900 px-6 py-2 rounded-full font-bold text-xl">
                    Pomodoro
                </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-6 pb-8">
                {isEditing ? (
                <div className="flex items-center gap-2 text-6xl">
                    <input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                    className="bg-transparent text-white text-center w-25 border-b-2 border-white focus:outline-none"
                    />
                    <span>:</span>
                    <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                    className="bg-transparent text-white text-center w-25 border-b-2 border-white focus:outline-none"
                    />
                    <span>:</span>
                    <input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                    className="bg-transparent text-white text-center w-25 border-b-2 border-white focus:outline-none"
                    />
                </div>
                ) : (
                <div 
                    className="text-8xl font-light cursor-pointer"
                    onClick={handleTimeClick}
                >
                    {hours > 0 ? `${formatTimeUnit(hours)}:` : ""}
                    {formatTimeUnit(minutes)}:
                    {formatTimeUnit(seconds)}
                </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-center pb-6 gap-4">
                {isEditing ? (
                <Button 
                    onClick={handleTimeUpdate}
                    className="bg-yellow-200 hover:bg-yellow-300 text-blue-900 px-12 py-6 rounded-full font-bold text-xl"
                >
                    Save
                </Button>
                ) : isRunning ? (
                <div className="flex gap-4">
                    <Button 
                    onClick={handlePause}
                    className="bg-yellow-200 hover:bg-yellow-300 text-blue-900 px-12 py-6 rounded-full font-bold text-xl"
                    >
                    Pause
                    </Button>
                    <Button 
                    onClick={handleReset}
                    className="bg-blue-800 hover:bg-blue-700 text-white px-12 py-6 rounded-full text-xl"
                    >
                    Reset
                    </Button>
                </div>
                ) : (
                <div className="flex gap-4">
                    <Button 
                    onClick={handleStart}
                    className="bg-yellow-200 hover:bg-yellow-300 text-blue-900 px-12 py-6 rounded-full font-bold text-xl"
                    >
                    Start
                    </Button>
                    <Button 
                    onClick={handleReset}
                    className="bg-blue-800 hover:bg-blue-700 text-white px-12 py-6 rounded-full text-xl"
                    >
                    Reset
                    </Button>
                </div>
                )}
            </CardFooter>
        </Card>
  );
};

export default PomodoroTimer;