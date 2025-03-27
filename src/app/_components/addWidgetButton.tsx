"use client";

import { Button } from "~/components/ui/button";
import { useWidgetManager } from "~/lib/widget-manager-context";
import { useGridStackContext } from "~/lib/grid-stack-context";

interface AddWidgetButtonProps {
  label?: string;
  widgetName: string;
  widgetProps?: Record<string, any>;
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  page?: number;
}

export default function AddWidgetButton({
  label = "Add Widget",
  widgetName,
  widgetProps = {},
  w = 2,
  h = 2,
  x = 0,
  y = 0,
  page,
}: AddWidgetButtonProps) {
  const { addWidgetToPage, currentPage } = useWidgetManager();
  const { addWidget } = useGridStackContext();

  const handleClick = () => {
    addWidget(() => ({
      w,
      h,
      x,
      y,
      content: JSON.stringify({
        name: widgetName,
        props: widgetProps,
      }),
    }));
  };

  return <Button onClick={handleClick}>{label}</Button>;
}
