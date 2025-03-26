import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { useWidgetManager } from "~/lib/widget-manager-context";
import { GridLayout } from "./gridLayout";
import AddWidgetButton from "./addWidgetButton";

import { Button } from "~/components/ui/button";

function RemoveSlideButton({ index }: { index: number }) {
  const { pages, removePage } = useWidgetManager();
  const totalPages = Object.keys(pages).length;

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={totalPages <= 1}
      onClick={(e) => {
        e.stopPropagation();
        removePage(index);
      }}
    >
      🗑️ Remove Slide {index + 1}
    </Button>
  );
}

function AddSlideButton() {
  const { setCurrentPage, pages, addPage } = useWidgetManager();

  const handleAddSlide = () => {
    const newPageIndex = Math.max(...Object.keys(pages).map(Number)) + 1;
    addPage(newPageIndex);
    setCurrentPage(newPageIndex); // optionally auto-navigate to it
  };

  return <Button onClick={handleAddSlide}>➕ Add Slide</Button>;
}

export default function MultiPageDashboard() {
  const { pages, setCurrentPage } = useWidgetManager();

  return (
    <Carousel className="w-full">
      <AddSlideButton></AddSlideButton>
      <CarouselContent>
        {Object.keys(pages).map((page, index) => (
          <CarouselItem key={page} onClick={() => setCurrentPage(Number(page))}>
            <AddWidgetButton
              label="Add Text1"
              widgetName="Text1"
              widgetProps={{ content: "Text 1!" }}
              w={3}
              h={2}
              page={index}
            />
            <AddWidgetButton
              label="Add Text2"
              widgetName="Text2"
              widgetProps={{ content: "Text 2!" }}
              w={3}
              h={2}
              page={index}
            />
            <GridLayout />
            <RemoveSlideButton index={index}></RemoveSlideButton>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
