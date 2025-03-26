"use client";

import { Button } from "~/components/ui/button";
import { useWidgetManager } from "~/lib/widget-manager-context";
import { useGridStackContext } from "~/lib/grid-stack-context";
import { v4 as uuidv4 } from "uuid";

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
  x,
  y,
  page,
}: AddWidgetButtonProps) {
  const { addWidgetToPage } = useWidgetManager();
  const handleClick = () => {
    const id = `widget-${uuidv4()}`;

    addWidgetToPage(
      {
        id,
        name: widgetName,
        props: widgetProps,
        w,
        h,
        x,
        y,
      },
      page,
    );
  };

  return <Button onClick={handleClick}>{label}</Button>;
}
