import { MusicPlayer } from "~/app/_components/MusicPlayer/MusicPlayer";
import TodolistComponent from "~/app/_components/TodoList/TodolistComponent";
export const COMPONENT_MAP = {
  TodolistComponent: () => <TodolistComponent />,
  MusicPlayer: () => <MusicPlayer />,
} as const;
