import { createContext, useContext } from "react";
import type { GridStackOptions } from "gridstack";

export type WidgetConfig = {
  id: string;
  name: string;
  props: Record<string, any>;
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
  setCurrentPage: (page: number) => void;
  addWidgetToPage: (widget: WidgetConfig, page?: number) => void;
  getGridOptions: (page: number) => GridStackOptions;
};

export const WidgetManagerContext =
  createContext<WidgetManagerContextType | null>(null);

export const useWidgetManager = () => {
  const context = useContext(WidgetManagerContext);
  if (!context) throw new Error("WidgetManager must be used in a provider");
  return context;
};
