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
  XIcon,
  Settings2,
  AudioWaveform,
} from "lucide-react";
import { createPortal } from "react-dom";

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

  const modalRef = useRef<HTMLDivElement>(null);

  // for searching
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [showModal, setShowModal] = useState(false);
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

  // Autoplay when done
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.load();

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
    if (isMuted || volume === 0) return <VolumeX size={16} />;
    if (volume < 0.5) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  };

  // Handle end of song
  const handleEnded = () => {
    next();
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!modalRef.current?.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showModal]);

  return (
    <div className="relative mx-auto flex h-full w-full flex-col rounded-xl bg-black/70 p-4 text-white shadow-lg backdrop-blur-xl">
      <style jsx>{`
        input[type="range"] {
          height: 5px;
          border-radius: 2px;
          transition: all 0.2s ease;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 5px;
          border-radius: 2px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          margin-top: -4px;
          height: 13px;
          width: 13px;
          background: white;
          border-radius: 50%;
          border: 2px solid;
          transition: all 0.2s ease;
        }
        input[type="range"]:hover::-webkit-slider-thumb {
          transform: scale(1.1);
        }
        input[type="range"]:active::-webkit-slider-thumb {
          transform: scale(0.9);
        }
      `}</style>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">FocuSpace</h1>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="text-gray-300 hover:text-white"
        >
          <Settings2 size={20} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center">
        <div>
          <h2 className="text-base font-semibold">{currentSong?.title}</h2>
        </div>
      </div>

      <div className="mt-3">
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
          className="h-1 w-full cursor-pointer appearance-none bg-gray-700"
          style={{
            background: `linear-gradient(to right, #6596b6 0%, #6596b6 ${progress}%, #4a4a4a ${progress}%, #4a4a4a 100%)`,
          }}
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={prev} className="text-gray-400 hover:text-white">
            <SkipBack size={24} />
          </button>

          <button
            onClick={playPause}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6596b6] text-white transition hover:bg-[#48a2df]"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button onClick={next} className="text-gray-400 hover:text-white">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-gray-400 hover:text-white"
          >
            <VolumeIcon />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="h-1 w-20 cursor-pointer appearance-none bg-gray-700"
            style={{
              background: `linear-gradient(to right, #6596b6 0%, #6596b6 ${(isMuted ? 0 : volume) * 100}%, #4a4a4a ${(isMuted ? 0 : volume) * 100}%, #4a4a4a 100%)`,
            }}
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      >
        <source src={currentSong?.url} type="audio/mpeg" />
      </audio>

      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div
              ref={modalRef}
              className="h-[calc(100vh-4rem)] max-h-[700px] w-[calc(100vw-4rem)] max-w-[1200px] overflow-hidden rounded-2xl bg-gray-900/90 p-20 shadow-2xl ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-white/90">
                  Select Sound
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-3 text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-95"
                >
                  <XIcon size={24} />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search sounds..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 placeholder-white/40 backdrop-blur-xl transition-all focus:border-white/20 focus:outline-none focus:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="max-h-[calc(100%-12rem)] overflow-y-auto rounded-xl">
                  {filteredSongs.slice(0, 10).map((song, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = 0;
                          audioRef.current.pause();
                        }
                        setCurrentSongIndex(songs.indexOf(song));
                        setShowModal(false);
                        setIsPlaying(true);
                      }}
                      className="mb-3 w-full rounded-xl bg-white/5 px-4 py-4 text-left transition-all hover:bg-white/10"
                    >
                      <div className="text-sm font-medium text-white/90">
                        <div className="flex items-center gap-2">
                          <AudioWaveform size={24} className="text-white/70" />
                          {song.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

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
