"use client";
import type { GridStack, GridStackOptions, GridStackWidget } from "gridstack";
import React, {
  type PropsWithChildren,
  useCallback,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { GridStackContext } from "./grid-stack-context";
import { GridStack as GridStackLib } from "gridstack";

interface GridStackProviderProps extends PropsWithChildren {
  pageId: number;
  initialOptions: GridStackOptions;
  onGridStackReady?: (gs: GridStack) => void;
}

export function GridStackProvider({
  children,
  initialOptions,
  onGridStackReady,
}: GridStackProviderProps) {
  const [gridStack, setGridStack] = useState<GridStack | null>(null);

  const [rawWidgetMetaMap, setRawWidgetMetaMap] = useState(() => {
    const map = new Map<string, GridStackWidget>();

    const deepFindNodeWithContent = (obj: GridStackWidget) => {
      if (obj.id && obj.content) {
        map.set(obj.id, obj);
      }
      if (obj.subGridOpts?.children) {
        obj.subGridOpts.children.forEach((child: GridStackWidget) => {
          deepFindNodeWithContent(child);
        });
      }
    };
    initialOptions.children?.forEach((child: GridStackWidget) => {
      deepFindNodeWithContent(child);
    });
    return map;
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!gridStack && containerRef.current) {
      const gs = GridStackLib.init(initialOptions, containerRef.current);

      setGridStack(gs);
      onGridStackReady?.(gs);
    }
  }, [gridStack, initialOptions, onGridStackReady]);

  const genRandomId = () =>
    `widget-${Math.random().toString(36).substring(2, 15)}`;

  const addWidget = useCallback(
    (fn: (id: string) => Omit<GridStackWidget, "id">) => {
      const newId = genRandomId();
      const widget = fn(newId);

      if (gridStack) {
        gridStack.addWidget({ ...widget, id: newId });
      }

      setRawWidgetMetaMap((prev) => {
        const newMap = new Map<string, GridStackWidget>(prev);
        newMap.set(newId, widget);
        return newMap;
      });
    },
    [gridStack],
  );

  const addSubGrid = useCallback(
    (
      fn: (
        id: string,
        withWidget: (w: Omit<GridStackWidget, "id">) => GridStackWidget,
      ) => Omit<GridStackWidget, "id">,
    ) => {
      const subGridId = `sub-grid-${Math.random().toString(36).substring(2, 15)}`;
      const subWidgetIdMap = new Map<string, GridStackWidget>();

      const widget = fn(subGridId, (w) => {
        const subId = genRandomId();
        subWidgetIdMap.set(subId, w);
        return { ...w, id: subId };
      });

      if (gridStack) {
        gridStack.addWidget({ ...widget, id: subGridId });
      }

      setRawWidgetMetaMap((prev) => {
        const newMap = new Map<string, GridStackWidget>(prev);
        subWidgetIdMap.forEach((meta, id) => {
          newMap.set(id, meta);
        });
        return newMap;
      });
    },
    [gridStack],
  );

  /** Removes a widget by ID. */
  const removeWidget = useCallback(
    (id: string) => {
      if (gridStack) {
        gridStack.removeWidget(id);
      }
      setRawWidgetMetaMap((prev) => {
        const newMap = new Map<string, GridStackWidget>(prev);
        newMap.delete(id);
        return newMap;
      });
    },
    [gridStack],
  );

  const saveOptions = useCallback(() => {
    return gridStack?.save(true, true, (_, widget) => widget);
  }, [gridStack]);

  return (
    <GridStackContext.Provider
      value={{
        initialOptions,
        gridStack,
        addWidget,
        removeWidget,
        addSubGrid,
        saveOptions,
        _gridStack: {
          value: gridStack,
          set: setGridStack,
        },
        _rawWidgetMetaMap: {
          value: rawWidgetMetaMap,
          set: setRawWidgetMetaMap,
        },
      }}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
        {children}
      </div>
    </GridStackContext.Provider>
  );
}
