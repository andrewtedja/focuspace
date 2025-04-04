import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

export function CarouselPagination({
  pageCount,
  selectedIndex,
  onSelectPage,
}: {
  pageCount: number;
  selectedIndex: number;
  onSelectPage: (index: number) => void;
}) {
  const maxVisible = 5;
  const shouldShowEllipsis = pageCount > maxVisible;

  const getVisiblePages = () => {
    if (!shouldShowEllipsis) {
      return [...Array(pageCount).keys()];
    }

    const start = Math.max(0, selectedIndex - 1);
    const end = Math.min(pageCount, selectedIndex + 2);
    const visible = [];

    if (start > 1) visible.push(0);
    for (let i = start; i < end; i++) visible.push(i);
    if (end < pageCount - 1) visible.push(pageCount - 1);

    return Array.from(new Set(visible)).sort((a, b) => a - b);
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (selectedIndex > 0) onSelectPage(selectedIndex - 1);
            }}
          />
        </PaginationItem>

        {visiblePages.map((i, idx) => {
          const showEllipsisBefore =
            idx > 0 && i - (visiblePages[idx - 1] ?? 0) > 1;
          return (
            <React.Fragment key={i}>
              {showEllipsisBefore && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={i === selectedIndex}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectPage(i);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            </React.Fragment>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (selectedIndex < pageCount - 1)
                onSelectPage(selectedIndex + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
