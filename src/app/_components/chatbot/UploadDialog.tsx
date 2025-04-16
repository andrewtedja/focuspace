"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Paperclip } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type CurrentFile = RouterOutput["pdfUpload"]["getCurrentFile"];
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface UploadDialogProps {
  currentFile: CurrentFile;
  isUploading: boolean;
  fileRef: React.RefObject<HTMLInputElement>;
  handleUpload: () => void;
}

/**
 * Dialog for uploading or updating a PDF
 */
export default function UploadDialog({
  currentFile,
  isUploading,
  fileRef,
  handleUpload,
}: UploadDialogProps) {
  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button className="h-9 w-9">
              <Paperclip />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {currentFile?.fileUuid ? "Update" : "Upload"} PDF Context
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent className="w-fit">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {currentFile?.fileUuid ? "Update" : "Upload"} PDF Context
          </AlertDialogTitle>
          <div className="space-y-2" />
          <Input
            type="file"
            ref={fileRef}
            accept="application/pdf"
            disabled={isUploading}
          />

          {currentFile?.fileName && (
            <p className="text-sm text-gray-600">
              Current file: <strong>{currentFile.fileName}</strong>
            </p>
          )}

          <VisuallyHidden>
            <div>Oops, you found me!</div>
          </VisuallyHidden>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Back</AlertDialogCancel>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? (
              <BeatLoader color="black" speedMultiplier={0.7} size={8} />
            ) : (
              <span>{currentFile?.fileUuid ? "Update" : "Upload"}</span>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
