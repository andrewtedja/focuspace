"use client";

import React from "react";
import { MusicPlayer } from "~/app/_components/MusicPlayer/MusicPlayer";

export default function MusicWidget({ content }: { content?: string }) {
  return (
    <div className="container-class h-full w-full">
      <MusicPlayer />
    </div>
  );
}
