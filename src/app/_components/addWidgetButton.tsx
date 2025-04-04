"use client";

import { Button } from "~/components/ui/button";
import { useWidgetManager } from "~/lib/widget-manager-context";
import { COMPONENT_MAP } from "~/lib/component-map";

interface AddWidgetButtonProps {
  label?: string;
  widgetName: keyof typeof COMPONENT_MAP;
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  page: number;
}

export default function AddWidgetButton({
  label = "Add Widget",
  widgetName,
  page,
  w = 2,
  h = 2,
  x = 0,
  y = 0,
}: AddWidgetButtonProps) {
  const { addWidgetToPage } = useWidgetManager();

  const handleClick = () => {
    addWidgetToPage(page, (newId) => ({
      id: newId,
      x,
      y,
      w,
      h,
      content: widgetName,
    }));
  };

  return <Button onClick={handleClick}>{label}</Button>;
}
