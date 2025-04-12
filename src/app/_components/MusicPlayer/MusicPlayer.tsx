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
  Settings,
  Settings2,
} from "lucide-react";
import Image from "next/image";
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

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
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

  // Auto-play on song change
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
    <div className="relative mx-auto flex h-full w-full flex-col rounded-xl bg-white p-4 text-black shadow-lg">
      <style jsx>{`
        /* Custom range slider styles */

        /* Track styles */
        input[type="range"]::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 2px;
        }

        input[type="range"]::-moz-range-track {
          height: 4px;
          border-radius: 2px;
        }

        /* Thumb styles */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          margin-top: -6px; /* To center thumb on track */
          height: 16px;
          width: 16px;
          background-color: white;
          border-radius: 50%;
          border: 2px solid black;
        }

        input[type="range"]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          background-color: black;
          border-radius: 50%;
          border: 2px solid white;
        }

        /* Focus styles */
        input[type="range"]:focus {
          outline: none;
        }
      `}</style>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Music Player</h1>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="text-gray-600 hover:text-black"
        >
          <Settings2 size={20} />
        </button>
      </div>

      <div className="mt-3 flex items-center">
        <div className="mr-3 flex h-16 w-16 items-center justify-center bg-gray-200">
          {currentSong?.cover ? (
            <Image
              src={currentSong.cover}
              alt="Cover"
              className="h-full w-full object-cover"
              width={64}
              height={64}
            />
          ) : (
            <div className="text-2xl">♪</div>
          )}
        </div>
        <div>
          <h2 className="text-base font-semibold">{currentSong?.title}</h2>
          <p className="text-sm text-gray-500">{currentSong?.artist}</p>
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
          className="h-1 w-full cursor-pointer appearance-none bg-gray-200"
          style={{
            background: `linear-gradient(to right, #000000 0%, #000000 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`,
          }}
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={prev} className="text-gray-700 hover:text-black">
            <SkipBack size={18} />
          </button>

          <button
            onClick={playPause}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button onClick={next} className="text-gray-700 hover:text-black">
            <SkipForward size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-gray-700 hover:text-black"
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
            className="h-1 w-20 cursor-pointer appearance-none bg-gray-200"
            style={{
              background: `linear-gradient(to right, #000000 0%, #000000 ${(isMuted ? 0 : volume) * 100}%, #e5e7eb ${(isMuted ? 0 : volume) * 100}%, #e5e7eb 100%)`,
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
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30">
            <div
              ref={modalRef}
              className="w-80 rounded-lg bg-white p-4 text-black shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Select a Sound</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-black"
                >
                  <XIcon size={20} />
                </button>
              </div>

              <div className="mt-3 space-y-3">
                <input
                  type="text"
                  placeholder="Search songs..."
                  className="w-full rounded-md border border-gray-300 bg-gray-50 p-1.5 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="max-h-48 space-y-1.5 overflow-y-auto">
                  {filteredSongs.slice(0, 10).map((song, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = 0;
                          audioRef.current.pause();
                        }

                        setCurrentSongIndex(songs.indexOf(song)); // make sure the real index is used
                        setShowModal(false);
                        setIsPlaying(true);
                      }}
                      className="w-full rounded-md bg-gray-100 px-3 py-1.5 text-left text-xs hover:bg-black hover:text-white"
                    >
                      <span className="font-semibold">{song.title}</span> –{" "}
                      <span className="text-gray-600">{song.artist}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
