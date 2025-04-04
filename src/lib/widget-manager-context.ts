import { createContext, useContext } from "react";
import type { GridStackOptions } from "gridstack";
import { GridStackWidget } from "gridstack";
import type { GridStack } from "gridstack";

export interface PageData {
  id: number;
  initialOptions: GridStackOptions;
  title?: string;
}

interface WidgetManagerContextValue {
  pages: PageData[];
  currentPageId: number;
  setCurrentPageId: (id: number) => void;
  addWidgetToPage: (
    pageId: number,
    fn: (id: string) => Omit<GridStackWidget, "id">,
  ) => void;
  addPage: () => void;
  removePage: (id: number) => void;
  registerGridStack: (pageId: number, grid: GridStack | null) => void; // ✅ ADD THIS
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
