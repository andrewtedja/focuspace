"use client";

import { useState, useRef, useEffect } from "react";
import { songs } from "~/data/songs";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react";

export const MusicPlayer = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLInputElement | null>(null);
  const currentSong = songs[currentSongIndex];

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
    if (!audioRef.current) return;

    // We don't need to call load() here as the audio element will load
    // automatically when the src changes via the rendered audio element

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error("Autoplay failed:", err);
      });
    }
  }, [currentSongIndex, isPlaying]);

  // Volume control
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Progress bar
  const handleTimeUpdate = () => {
    if (!audioRef.current || isDragging) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;
    setProgress((current / duration) * 100);
    setCurrentTime(current);
    setDuration(duration);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleSeekStart = () => {
    setIsDragging(true);
  };

  const handleSeekEnd = () => {
    setIsDragging(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const duration = audioRef.current.duration || 1;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
    setCurrentTime(newTime);
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  // Handle end of song
  const handleEnded = () => {
    next();
  };

  return (
    <div className="mx-auto max-w-md rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-6 text-white shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="truncate text-xl font-bold">{currentSong?.title}</h2>
          <p className="truncate text-sm text-gray-300">
            {currentSong?.artist}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 p-2 shadow-md">
          {currentSong?.cover ? (
            <img
              src={currentSong.cover}
              alt="Cover"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-600">
              <span className="text-xs">♪</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          onMouseDown={handleSeekStart}
          onMouseUp={handleSeekEnd}
          onTouchStart={handleSeekStart}
          onTouchEnd={handleSeekEnd}
          ref={progressBarRef}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
          style={{
            background: `linear-gradient(to right, #4ade80 0%, #4ade80 ${progress}%, #374151 ${progress}%, #374151 100%)`,
          }}
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-8">
        <button
          onClick={prev}
          className="rounded-full p-2 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        >
          <SkipBack size={24} />
        </button>

        <button
          onClick={playPause}
          className="flex items-center justify-center rounded-full bg-green-500 p-4 text-white transition-colors hover:bg-green-600"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={next}
          className="rounded-full p-2 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <button onClick={toggleMute} className="text-gray-300 hover:text-white">
          <VolumeIcon />
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="h-1.5 w-1/3 cursor-pointer appearance-none rounded-lg bg-gray-700"
          style={{
            background: `linear-gradient(to right, #4ade80 0%, #4ade80 ${(isMuted ? 0 : volume) * 100}%, #374151 ${(isMuted ? 0 : volume) * 100}%, #374151 100%)`,
          }}
        />
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      >
        <source src={currentSong?.url} type="audio/mpeg" />
      </audio>
    </div>
  );
};
