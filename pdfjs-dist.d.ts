// declare module "pdfjs-dist/build/pdf.min.mjs";
// declare module "pdfjs-dist/build/pdf.worker.min.mjs";
declare module "pdfjs-dist/build/pdf" {
  // Option 1: If you want to import all exports as 'any'
  export * from "pdfjs-dist/types/src/pdf";

  // Option 2: If you want to re-export everything from the internal types (if they are available)
  // export * from "pdfjs-dist/types/src/pdf";
}
