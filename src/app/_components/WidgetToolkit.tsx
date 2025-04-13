"use client";

import { Button } from "~/components/ui/button";
import AddWidgetButton from "./addWidgetButton";
import { useWidgetManager } from "~/lib/widget-manager-context";

interface WidgetToolkitProps {
  setAddingPage: (val: boolean) => void;
  setRemovingPage: (val: boolean) => void;
  disabled?: boolean;
}

export default function WidgetToolkit({
  setAddingPage,
  setRemovingPage,
  disabled = false,
}: WidgetToolkitProps) {
  const { currentPageId, pages } = useWidgetManager();

  return (
    <div className="flex w-96 flex-col flex-wrap gap-2 p-2">
      <Button onClick={() => setAddingPage?.(true)}>➕ Add Slide</Button>
      <AddWidgetButton
        label="Add MusicPlayer"
        widgetName="MusicPlayer"
        w={4}
        h={1}
        page={currentPageId}
      />

      <Button
        variant="destructive"
        disabled={pages.length <= 1 || disabled}
        onClick={() => setRemovingPage?.(true)}
      >
        🗑️ Remove Slide {currentPageId}
      </Button>
    </div>
  );
}
