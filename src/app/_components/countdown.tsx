import React, { useState, useEffect, useRef } from "react";

interface CountdownTimerProps {
  initialTime: number;
  start: boolean;
  reset: boolean;
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  setReset: React.Dispatch<React.SetStateAction<boolean>>;
  setFinish: React.Dispatch<React.SetStateAction<boolean>>;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialTime,
  start,
  reset,
  setStart,
  setReset,
  setFinish,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle start/pause logic
  useEffect(() => {
    if (start && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!start && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [start]);

  // Handle timer completion inside useEffect
  useEffect(() => {
    if (timeLeft === 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      //   setTimeout(() => setFinish(true), 0); // Delay to avoid triggering during render
      setFinish(true);
    }
  }, [timeLeft, setFinish]);

  // Handle external reset request inside useEffect
  useEffect(() => {
    if (reset) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimeLeft(initialTime);
      setFinish(false);
      setStart(false);
      setReset(false);
      //   setTimeout(() => setFinish(false), 0); // Delay to avoid triggering during render
      //   setTimeout(() => setStart(false), 0); // Delay to avoid triggering during render
      //   setTimeout(() => setReset(false), 0); // Ensure the reset flag is cleared safely
    }
  }, [reset, initialTime, setFinish, setReset]);

  return <div className="text-9xl font-bold">{timeLeft}</div>;
};

export default CountdownTimer;
