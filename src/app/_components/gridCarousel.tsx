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
import "gridstack/dist/gridstack-extra.css";
import "gridstack/dist/gridstack.css";
import "~/styles/demo.css";
import { CarouselPagination } from "./CarouselPagination";
import { AppSidebar } from "./app_sidebar";

/**
 * Component for the main grid carousel layout.
 */
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
  const [removingPage, setRemovingPage] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;
    const handleSelect = () => {
      setSelectedIndex(carouselApi.selectedScrollSnap());
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
    } else if (removingPage) {
      const currentIndex = pages.findIndex((p) => p.id === currentPageId);
      let targetIndex = currentIndex === 0 ? 1 : currentIndex - 1;
      const onScrollFinish = () => {
        const pageAtIndex = pages[targetIndex];
        if (!pageAtIndex) return;
        removePage(currentPageId);
        if (targetIndex === 1 && currentIndex === 0) {
          carouselApi.scrollTo(0, true);
          targetIndex = 0;
        }
        setDisabled(false);
      };
      setDisabled(true);
      carouselApi.scrollTo(targetIndex, false);
      setTimeout(() => {
        onScrollFinish();
      }, 1000);
      setRemovingPage(false);
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
    removingPage,
    setRemovingPage,
    removePage,
  ]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AppSidebar
        setAddingPage={setAddingPage}
        setRemovingPage={setRemovingPage}
        disabled={disabled}
      />
      {/* <WidgetToolkit
        setAddingPage={setAddingPage}
        setRemovingPage={setRemovingPage}
        disabled={disabled}
      ></WidgetToolkit> */}
      <Carousel
        setApi={setCarouselApi}
        className="flex h-full w-full flex-col justify-between"
      >
        <CarouselContent className="flex-1">
          {pages.map((page) => (
            <CarouselItem key={page.id}>
              <GridStackProvider
                key={page.id}
                pageId={page.id}
                initialOptions={page.initialOptions}
                onGridStackReady={(gs) => registerGridStack(page.id, gs)}
              >
                <GridStackRenderProvider>
                  <div
                    // ! GRID STACK
                    className="grid-stack relative"
                    style={{
                      backgroundSize: "cover",
                      backgroundImage: `url(${page.backgroundImage})`,
                      backgroundPosition: "center",
                      height: "100%",
                      width: "100%",
                      backgroundRepeat: "no-repeat",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 bg-black"
                      style={{ opacity: page.backgroundOverlayOpacity ?? 0 }}
                    />
                    <GridStackRender componentMap={COMPONENT_MAP} />{" "}
                  </div>
                </GridStackRenderProvider>
              </GridStackProvider>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="mx-2 px-4 py-2" />
        <CarouselNext className="mx-2 px-4 py-2" />
        {/* //! MAIN PAGINATION */}
        <div className="bg-white/70 bg-opacity-0 px-4 py-2 backdrop-blur-md">
          <CarouselPagination
            pageCount={pages.length}
            selectedIndex={selectedIndex}
            onSelectPage={(index) => carouselApi?.scrollTo(index)}
          />
        </div>
      </Carousel>
    </div>
  );
}
