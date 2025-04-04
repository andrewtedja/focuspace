import {
  PropsWithChildren,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useGridStackContext } from "./grid-stack-context";
import { GridStack, GridStackOptions, GridStackWidget } from "gridstack";
import { GridStackRenderContext } from "./grid-stack-render-context";
import isEqual from "react-fast-compare";
import ReactDOM from "react-dom/client";
import { COMPONENT_MAP } from "./component-map";

export function GridStackRenderProvider({ children }: PropsWithChildren) {
  const {
    _gridStack: { value: gridStack, set: setGridStack },
    initialOptions,
  } = useGridStackContext();

  const widgetContainersRef = useRef<Map<string, HTMLElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<GridStackOptions>(initialOptions);

  const logAllNodes = useCallback((gs: GridStack | null, label: string) => {
    if (!gs) return;
    console.log(
      `==== ${label}: enumerating ${gs.engine.nodes.length} node(s) ====`,
    );
    gs.engine.nodes.forEach((node) => {
      console.log(
        "Node ID:",
        node.id,
        "| w:",
        node.w,
        "| h:",
        node.h,
        "| content:",
        node.content,
      );
    });
  }, []);

  const renderCBFn = useCallback(
    (element: HTMLElement, widget: GridStackWidget) => {
      if (widget.id && typeof widget.content === "string") {
        // console.log("Widget added to DOM:", widget.id, widget.content);
        widgetContainersRef.current.set(widget.id, element);

        const Component =
          COMPONENT_MAP[widget.content as keyof typeof COMPONENT_MAP];

        if (Component) {
          const root = ReactDOM.createRoot(element);
          root.render(<Component />);
        } else {
          console.warn("Unknown component:", widget.content);
        }
      }
    },
    [],
  );

  const initGrid = useCallback(() => {
    if (containerRef.current) {
      GridStack.renderCB = renderCBFn;
      const gs = GridStack.init(optionsRef.current, containerRef.current);
      // logAllNodes(gs, "After initGrid");
      return gs;
    }
    return null;
  }, [renderCBFn, logAllNodes]);

  useLayoutEffect(() => {
    if (!isEqual(initialOptions, optionsRef.current) && gridStack) {
      try {
        // console.log("Reinitializing grid. Possibly removing all nodes");
        gridStack.removeAll(false);
        gridStack.destroy(false);
        widgetContainersRef.current.clear();
        optionsRef.current = initialOptions;

        const newGs = initGrid();
        setGridStack(newGs);

        // setTimeout(() => {
        //   logAllNodes(newGs, "After re-init");
        // }, 0);
      } catch (e) {
        console.error("Error reinitializing gridstack", e);
      }
    }
  }, [initialOptions, gridStack, initGrid, setGridStack, logAllNodes]);

  useLayoutEffect(() => {
    if (!gridStack) {
      try {
        const newGs = initGrid();
        setGridStack(newGs);

        // setTimeout(() => {
        //   logAllNodes(newGs, "After first init (mount)");
        // }, 0);
      } catch (e) {
        console.error("Error initializing gridstack", e);
      }
    }
  }, [gridStack, initGrid, setGridStack, logAllNodes]);

  return (
    <GridStackRenderContext.Provider
      value={useMemo(
        () => ({
          getWidgetContainer: (widgetId: string) => {
            return widgetContainersRef.current.get(widgetId) || null;
          },
        }),
        [gridStack],
      )}
    >
      <div ref={containerRef}>{gridStack ? children : null}</div>
    </GridStackRenderContext.Provider>
  );
}
