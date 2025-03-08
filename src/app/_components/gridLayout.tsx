"use client";
import { GridStackProvider } from "~/lib/grid-stack-provider";
import { GridStackRender } from "~/lib/grid-stack-render";
import { GridStackRenderProvider } from "~/lib/grid-stack-render-provider";
import "gridstack/dist/gridstack.css";
import "gridstack/dist/gridstack-extra.css";
import React from "react";

function Text({ content }: { content: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-red-400">
      {content}
    </div>
  );
}
function Text2({ content }: { content: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-red-400">
      {content}
    </div>
  );
}

const COMPONENT_MAP = {
  Text,
  Text2,
  // ... other components
};

const gridOptions = {
  acceptWidgets: true,
  margin: 8,
  cellHeight: 50,
  // cellHeightUnit: "20rem",

  children: [
    {
      id: "item1",
      h: 2,
      w: 2,
      content: JSON.stringify({
        name: "Text2",
        props: { content: "Item 1" },
      }),
    },
    {
      id: "item2",
      h: 2,
      w: 2,
      content: JSON.stringify({
        name: "Text",
        props: { content: "Item 2" },
      }),
    },
    // ... other grid items
  ],
};

const GridLayout = () => {
  return (
    <GridStackProvider initialOptions={gridOptions}>
      <GridStackRenderProvider>
        <GridStackRender componentMap={COMPONENT_MAP} />
      </GridStackRenderProvider>
    </GridStackProvider>
  );
};

export default GridLayout;
