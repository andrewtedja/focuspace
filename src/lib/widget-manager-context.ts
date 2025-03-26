import { createContext, useContext } from "react";

export type WidgetConfig = {
  id: string;
  name: string;
  props: any;
  w: number;
  h: number;
  x?: number;
  y?: number;
};

export type WidgetManagerContextType = {
  pages: Record<number, WidgetConfig[]>;
  currentPage: number;
  addPage: (pageNumber?: number) => void;
  removePage: (pageNumber: number) => void;
  setCurrentPage: (n: number) => void;
  addWidgetToPage: (widget: WidgetConfig, page?: number) => void;
  removeWidgetFromPage: (id: string, page?: number) => void;
  getWidgetsForPage: (page?: number) => WidgetConfig[];
};

export const WidgetManagerContext = createContext<{
  pages: Record<number, WidgetConfig[]>;
  currentPage: number;
  addPage: (pageNumber?: number) => void;
  removePage: (pageNumber: number) => void;
  setCurrentPage: (n: number) => void;
  addWidgetToPage: (widget: WidgetConfig, page?: number) => void;
  removeWidgetFromPage: (id: string, page?: number) => void;
  getWidgetsForPage: (page?: number) => WidgetConfig[];
} | null>(null);

export function useWidgetManager() {
  const context = useContext(WidgetManagerContext);
  if (!context) {
    throw new Error(
      "useWidgetManager must be used within a WidgetManagerProvider",
    );
  }
  return context;
}
