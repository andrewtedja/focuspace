import { createContext, useContext } from "react";
import type { GridStackOptions } from "gridstack";
import { GridStackWidget } from "gridstack";
import type { GridStack } from "gridstack";

export interface PageData {
  id: number;
  initialOptions: GridStackOptions;
  title?: string;
  backgroundImage?: string;
  backgroundOverlayOpacity?: number;
}

interface WidgetManagerContextValue {
  pages: PageData[];
  currentPageId: number;
  setCurrentPageId: (id: number) => void;
  addPage: () => void;
  removePage: (id: number) => void;
  addWidgetToPage: (
    pageId: number,
    widgetName: string,
    fn: (id: string) => Omit<GridStackWidget, "id">,
  ) => void | (() => void);
  registerGridStack: (pageId: number, grid: GridStack | null) => void;
  transferWidgetToPage: (
    widgetName: string,
    fromPageId: number,
    toPageId: number,
    fn: (id: string) => Omit<GridStackWidget, "id">,
  ) => void;

  // update background image
  updatePageBackground: (
    pageId: number,
    backgroundUrl: string,
    overlayOpacity?: number,
  ) => void;
}

export const WidgetManagerContext =
  createContext<WidgetManagerContextValue | null>(null);

export function useWidgetManager() {
  const ctx = useContext(WidgetManagerContext);
  if (!ctx) {
    throw new Error(
      "useWidgetManager must be used within a WidgetManagerProvider",
    );
  }
  return ctx;
}
