import { useWidgetManager } from "~/lib/widget-manager-context";
import { useEffect, useRef } from "react";
import { GridStack } from "gridstack";
import Text1 from "~/widgets/Text1"; // adjust as needed
import Text2 from "~/widgets/Text2";
import type { GridItemHTMLElement } from "gridstack";
import { createRoot } from "react-dom/client";

const COMPONENT_MAP = {
  Text1: (props: any) => <Text1 {...props} />,
  Text2: (props: any) => <Text2 {...props} />,
};

export const GridLayout = () => {
  const { pages, currentPage } = useWidgetManager();
  const gridRef = useRef<GridStack | null>(null);
  const widgets = pages[currentPage] ?? [];

  useEffect(() => {
    const gridEl = document.querySelector(
      `.grid-stack[data-slide="${currentPage}"]`,
    ) as GridItemHTMLElement;
    if (!gridEl) return;

    if (!gridRef.current) {
      gridRef.current = GridStack.init({}, gridEl);
    }

    const grid = gridRef.current;
    grid.removeAll();

    widgets.forEach(({ id, name, props, w, h }) => {
      const el = document.createElement("div");
      el.className = "grid-stack-item";
      el.setAttribute("gs-id", id);
      el.setAttribute("gs-w", String(w));
      el.setAttribute("gs-h", String(h));

      const content = document.createElement("div");
      content.className = "grid-stack-item-content";
      el.appendChild(content);

      gridEl.appendChild(el);
      grid.makeWidget(el);

      const Component = COMPONENT_MAP[name as keyof typeof COMPONENT_MAP];
      if (Component) {
        const root = createRoot(content);
        root.render(<Component {...props} />);
      }
    });
  }, [widgets, currentPage]);

  return <div className="grid-stack h-[600px]" data-slide={currentPage}></div>;
};
