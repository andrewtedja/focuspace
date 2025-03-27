"use client";
import { WidgetManagerContext } from "./widget-manager-context";
import { type WidgetConfig } from "./widget-manager-context";
import { GridStackOptions } from "gridstack";

import { type PropsWithChildren, useCallback, useState } from "react";

const CELL_HEIGHT = 50;
const BREAKPOINTS = [
  { c: 1, w: 700 },
  { c: 3, w: 850 },
  { c: 6, w: 950 },
  { c: 8, w: 1100 },
];

export const baseGridOptions: GridStackOptions = {
  removable: true,
  acceptWidgets: true,
  columnOpts: {
    breakpointForWindow: true,
    breakpoints: BREAKPOINTS,
    layout: "moveScale",
    columnMax: 12,
  },
  float: true,
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
export function WidgetManagerProvider({ children }: PropsWithChildren) {
  const [pages, setPages] = useState<Record<number, WidgetConfig[]>>({
    0: [],
  });
  const [currentPage, setCurrentPage] = useState(0);

  const addPage = useCallback(
    (pageNumber?: number) => {
      setPages((prev) => {
        const nextPage =
          pageNumber ?? Math.max(...Object.keys(prev).map(Number), 0) + 1;
        if (prev[nextPage]) return prev;
        return {
          ...prev,
          [nextPage]: [],
        };
      });
      setCurrentPage((prev) => {
        const nextPage =
          pageNumber ?? Math.max(...Object.keys(pages).map(Number), 0) + 1;
        return nextPage;
      });
    },
    [pages],
  );

  const removePage = useCallback((pageNumber: number) => {
    setPages((prev) => {
      const newPages = { ...prev };
      delete newPages[pageNumber];
      return newPages;
    });

    setCurrentPage((prev) => {
      if (prev === pageNumber) return 0;
      if (prev > pageNumber) return prev - 1;
      return prev;
    });
  }, []);

  const addWidgetToPage = useCallback(
    (widget: WidgetConfig, page = currentPage) => {
      setPages((prev) => ({
        ...prev,
        [page]: [...(prev[page] ?? []), widget],
      }));
    },
    [currentPage],
  );

  const getGridOptions = useCallback(
    (page: number) => {
      return {
        ...baseGridOptions,
        children: (pages[page] ?? []).map((w) => ({
          id: w.id,
          w: w.w,
          h: w.h,
          x: w.x,
          y: w.y,
          content: JSON.stringify({ name: w.name, props: w.props }),
        })),
      };
    },
    [pages],
  );

  return (
    <WidgetManagerContext.Provider
      value={{
        pages,
        currentPage,
        addPage,
        removePage,
        setCurrentPage,
        addWidgetToPage,
        getGridOptions,
      }}
    >
      {children}
    </WidgetManagerContext.Provider>
  );
}
