import React from "react";
import { MusicPlayer } from "~/app/_components/MusicPlayer/MusicPlayer";

export default function MusicWidget({ content }: { content?: string }) {
  return (
    <div className="relative min-h-[200px] overflow-hidden">
      <MusicPlayer />
    </div>
  );
}
