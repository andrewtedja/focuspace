"use client";

import { useState, useRef, useEffect } from "react";
import { songs } from "~/data/songs";

export const MusicPlayer = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const currentSong = songs[currentSongIndex];

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playPause = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Failed to play:", err);
      }
    }
  };

  const next = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  };

  const prev = () => {
    setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
  };

  // Auto-play on song change
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        audioRef.current.load();
        if (isPlaying) {
          try {
            await audioRef.current.play();
          } catch (err) {
            console.error("Autoplay failed:", err);
          }
        }
      }
    };
    playAudio().catch((err) => console.error("playAudio failed:", err));
  }, [currentSongIndex, isPlaying]);

  // Volume
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Progress bar
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;
    // console.log("Time update:", current, "/", duration);
    setProgress((current / duration) * 100);
    setCurrentTime(current);
    setDuration(duration);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const duration = audioRef.current.duration || 1;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = newTime;
  };
  return (
    <div className="mx-auto max-w-md rounded-xl bg-gray-800 p-4 text-white">
      <h2 className="text-xl font-bold">{currentSong?.title}</h2>
      <p className="text-sm text-gray-300">{currentSong?.artist}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs">🔈</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full accent-green-400"
        />
      </div>

      <audio
        ref={audioRef}
        className="mt-4 w-full"
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={currentSong?.url} type="audio/mpeg" />
      </audio>

      <div className="mt-4 flex justify-center gap-4">
        <button onClick={prev}>⏮️</button>
        <button onClick={playPause}>{isPlaying ? "⏸️" : "▶️"}</button>
        <button onClick={next}>⏭️</button>
      </div>
      <div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="mt-2 h-1 w-full appearance-none rounded bg-gray-600 accent-green-400"
        />
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-300">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};
