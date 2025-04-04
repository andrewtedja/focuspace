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

export default function GridCarouselLayout() {
  const {
    pages,
    currentPageId,
    setCurrentPageId,
    addPage,
    removePage,
    registerGridStack,
  } = useWidgetManager();

  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [addingPage, setAddingPage] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;

    const handleSelect = () => {
      const newIndex = carouselApi.selectedScrollSnap();
      if (newIndex >= 0 && newIndex < pages.length) {
        const pageAtIndex = pages[newIndex];
        if (!pageAtIndex) return;
        setCurrentPageId(pageAtIndex.id);
      }
      console.log("Carousel selected index:", newIndex);
    };

    carouselApi.on("select", handleSelect);

    if (addingPage) {
      addPage();
      setAddingPage(false);
      setTimeout(() => {
        carouselApi.scrollTo(pages.length, false);
      }, 0);
    }

    const indexOfCurrent = pages.findIndex((p) => p.id === currentPageId);
    if (indexOfCurrent >= 0) {
      carouselApi.scrollTo(indexOfCurrent, false);
    }

    return () => {
      carouselApi.off("select", handleSelect);
    };
  }, [
    carouselApi,
    pages,
    addingPage,
    addPage,
    setAddingPage,
    currentPageId,
    setCurrentPageId,
  ]);

  return (
    <div className="h-screen w-full">
      <div className="mb-2 flex justify-between">
        <Button onClick={() => setAddingPage(true)}>➕ Add Slide</Button>
      </div>

      <Carousel setApi={setCarouselApi} className="h-full w-full">
        <CarouselContent>
          {pages.map((page) => (
            <CarouselItem key={page.id}>
              <AddWidgetButton
                label="Add Text"
                widgetName="Text"
                w={3}
                h={3}
                page={page.id}
              />
              <AddWidgetButton
                label="Add Text 1"
                widgetName="Text1"
                w={2}
                h={2}
                page={page.id}
              />
              <AddWidgetButton
                label="Add Text 2"
                widgetName="Text2"
                w={1}
                h={1}
                page={page.id}
              />
              <Button
                variant="destructive"
                disabled={pages.length <= 1}
                onClick={() => removePage(page.id)}
              >
                🗑️ Remove Slide {page.title ?? page.id}
              </Button>
              <GridStackProvider
                key={page.id}
                pageId={page.id}
                initialOptions={page.initialOptions}
                onGridStackReady={(gs) => registerGridStack(page.id, gs)}
              >
                <GridStackRenderProvider>
                  <div className="flex flex-col gap-2">
                    <div className="grid-stack">
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
