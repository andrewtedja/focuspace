"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";
import { useEffect, useState } from "react";
import { useWidgetManager } from "~/lib/widget-manager-context";
import { GridStackProvider } from "~/lib/grid-stack-provider";
import { GridStackRenderProvider } from "~/lib/grid-stack-render-provider";
import { GridStackRender } from "~/lib/grid-stack-render";
import { COMPONENT_MAP } from "~/lib/component-map";
import AddWidgetButton from "./addWidgetButton";
import { Button } from "~/components/ui/button";
import "gridstack/dist/gridstack-extra.css";
import "gridstack/dist/gridstack.css";
import "~/styles/demo.css";
import { baseGridOptions } from "~/lib/widget-manager-provider";

export default function GridCarouselLayout() {
  const { pages, setCurrentPage, addPage, removePage } = useWidgetManager();
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!carouselApi) return () => undefined;

    const onSelect = () => {
      const newIndex = carouselApi.selectedScrollSnap();
      const pageKeys = Object.keys(pages).map(Number);
      const pageAtIndex = pageKeys[newIndex];
      if (pageAtIndex !== undefined) {
        setCurrentPage(pageAtIndex);
      }
    };

    onSelect();
    carouselApi.on("select", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi, pages, setCurrentPage]);
  const handleAddSlide = () => {
    const newPageIndex = Math.max(...Object.keys(pages).map(Number), 0) + 1;
    addPage(newPageIndex);
    setCurrentPage(newPageIndex);
  };

  return (
    <div className="h-[600px] w-full">
      <div className="mb-2 flex justify-between">
        <Button onClick={handleAddSlide}>➕ Add Slide</Button>
      </div>
      <Carousel setApi={setCarouselApi} className="h-full w-full">
        <CarouselContent>
          {Object.entries(pages).map(([pageKey, widgets]) => (
            <CarouselItem key={pageKey}>
              <GridStackProvider
                initialOptions={{ ...baseGridOptions, children: widgets }}
              >
                <GridStackRenderProvider>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <AddWidgetButton
                        label="Add Text"
                        widgetName="Text"
                        widgetProps={{ content: "Text!" }}
                        w={3}
                        h={2}
                        page={parseInt(pageKey)}
                      />
                      <AddWidgetButton
                        label="Add Text 1"
                        widgetName="Text1"
                        widgetProps={{ content: "Text 1!" }}
                        w={3}
                        h={2}
                        page={parseInt(pageKey)}
                      />
                      <AddWidgetButton
                        label="Add Text 2"
                        widgetName="Text2"
                        widgetProps={{ content: "Text 2!" }}
                        w={3}
                        h={2}
                        page={parseInt(pageKey)}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={Object.keys(pages).length <= 1}
                        onClick={() => removePage(parseInt(pageKey))}
                      >
                        🗑️ Remove Slide {parseInt(pageKey) + 1}
                      </Button>
                    </div>
                    <div className="grid-stack min-h-[600px]">
                      <GridStackRender componentMap={COMPONENT_MAP} />
                    </div>
                  </div>
                </GridStackRenderProvider>
              </GridStackProvider>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
