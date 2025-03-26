"use client";
import { WidgetManagerContext } from "./widget-manager-context";
import { type WidgetConfig } from "./widget-manager-context";
import { useGridStackContext } from "./grid-stack-context";
import { type PropsWithChildren, useCallback, useMemo, useState } from "react";

export function WidgetManagerProvider({ children }: PropsWithChildren) {
  const { addWidget: addGridWidget, removeWidget: removeGridWidget } =
    useGridStackContext();

  const [pages, setPages] = useState<Record<number, WidgetConfig[]>>({ 0: [] });
  const [currentPage, setCurrentPage] = useState(0);

  const getWidgetsForPage = useCallback(
    (page = currentPage) => pages[page] ?? [],
    [pages, currentPage],
  );

  const addPage = useCallback((pageNumber?: number) => {
    setPages((prev) => {
      const nextPage =
        pageNumber ?? Math.max(...Object.keys(prev).map(Number)) + 1;

      if (prev[nextPage]) return prev;
      return {
        ...prev,
        [nextPage]: [],
      };
    });
  }, []);

  const removePage = useCallback((pageNumber: number) => {
    setPages((prev) => {
      const newPages = Object.entries(prev)
        .filter(([key]) => Number(key) !== pageNumber)
        .sort(([a], [b]) => Number(a) - Number(b))
        .reduce(
          (acc, [, value], idx) => {
            acc[idx] = value;
            return acc;
          },
          {} as Record<number, WidgetConfig[]>,
        );

      return newPages;
    });

    setCurrentPage((prev) => {
      if (prev === pageNumber) return 0;
      if (prev > pageNumber) return prev - 1;
      return prev;
    });
  }, []);

  const { gridStack, addWidget } = useGridStackContext();

  const addWidgetToPage = useCallback(
    (widget: WidgetConfig, page = currentPage) => {
      const { id, w, h, x, y } = widget;

      setPages((prev) => ({
        ...prev,
        [page]: [...(prev[page] ?? []), widget],
      }));

      // if (!gridStack) {
      //   console.warn("GridStack not ready when adding widget");
      //   return;
      // }

      addWidget(() => ({
        id,
        w,
        h,
        content: JSON.stringify({ name: widget.name, props: widget.props }),
      }));
    },
    [currentPage, gridStack, addGridWidget],
  );

  const removeWidgetFromPage = useCallback(
    (id: string, page = currentPage) => {
      setPages((prev) => ({
        ...prev,
        [page]: (prev[page] ?? []).filter((w) => w.id !== id),
      }));

      removeGridWidget(id);
    },
    [currentPage, removeGridWidget],
  );

  const value = useMemo(
    () => ({
      pages,
      currentPage,
      setCurrentPage,
      addWidgetToPage,
      removeWidgetFromPage,
      getWidgetsForPage,
      addPage,
      removePage,
    }),
    [
      pages,
      currentPage,
      addWidgetToPage,
      removeWidgetFromPage,
      addPage,
      removePage,
    ],
  );
  return (
    <WidgetManagerContext.Provider value={value}>
      {children}
    </WidgetManagerContext.Provider>
  );
}
