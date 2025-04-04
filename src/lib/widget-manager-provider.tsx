"use client";

import { ReactNode, useState, useCallback } from "react";
import { WidgetManagerContext, PageData } from "./widget-manager-context";
import { GridStack, GridStackOptions, GridStackWidget } from "gridstack";

const CELL_HEIGHT = 50;
const BREAKPOINTS = [
  { c: 1, w: 700 },
  { c: 3, w: 850 },
  { c: 6, w: 950 },
  { c: 8, w: 1100 },
];
export const BASE_GRID_OPTIONS: GridStackOptions = {
  removable: true,
  acceptWidgets: true,
  columnOpts: {
    breakpointForWindow: true,
    breakpoints: BREAKPOINTS,
    layout: "moveScale",
    columnMax: 12,
  },
  float: true,
  itemClass: "grid-stack-item",
  margin: 8,
  row: 12,
  cellHeight: CELL_HEIGHT,
  subGridOpts: {
    acceptWidgets: true,
    columnOpts: {
      breakpoints: BREAKPOINTS,
      layout: "moveScale",
    },
    margin: 8,
    minRow: 2,
    cellHeight: CELL_HEIGHT,
  },
};

export function WidgetManagerProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<PageData[]>([
    {
      id: 0,
      initialOptions: { ...BASE_GRID_OPTIONS, children: [] },
      title: "Page 0",
    },
  ]);

  const [currentPageId, setCurrentPageId] = useState<number>(0);

  const [pageStacks, setPageStacks] = useState<
    Record<number, GridStack | null>
  >({
    0: null,
  });

  const addPage = useCallback(() => {
    let localNewId = -1;

    setPages((prev) => {
      localNewId = prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 0;

      const newPage: PageData = {
        id: localNewId,
        initialOptions: {
          ...BASE_GRID_OPTIONS,
          children: [],
        },
        title: `Page ${localNewId}`,
      };
      return [...prev, newPage];
    });

    setCurrentPageId((prev) => prev + 1);

    setPageStacks((prev) => ({
      ...prev,
      [localNewId]: null,
    }));
  }, []);

  const removePage = useCallback(
    (id: number) => {
      setPages((prev) => prev.filter((p) => p.id !== id));
      setPageStacks((prev) => {
        const newStacks = { ...prev };
        delete newStacks[id];
        return newStacks;
      });
      if (id === currentPageId) {
        setCurrentPageId(0);
      }
    },
    [currentPageId],
  );

  const registerGridStack = useCallback(
    (pageId: number, grid: GridStack | null) => {
      setPageStacks((prev) => ({
        ...prev,
        [pageId]: grid,
      }));
    },
    [],
  );

  const addWidgetToPage = useCallback(
    (pageId: number, fn: (id: string) => Omit<GridStackWidget, "id">) => {
      const stack = pageStacks[pageId];
      if (!stack) {
        console.warn("No gridStack found for page:", pageId);
        return;
      }
      const newId = `widget-${Math.random().toString(36).substring(2, 15)}`;
      const partialWidget = fn(newId);

      stack.addWidget({ ...partialWidget, id: newId });
    },
    [pageStacks],
  );

  return (
    <WidgetManagerContext.Provider
      value={{
        pages,
        currentPageId,
        setCurrentPageId,
        addPage,
        removePage,
        addWidgetToPage,
        registerGridStack,
      }}
    >
      {children}
    </WidgetManagerContext.Provider>
  );
}
