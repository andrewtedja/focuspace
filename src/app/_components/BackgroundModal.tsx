"use client";
import { useState } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { initialRooms } from "~/data/rooms";
import { useWidgetManager } from "~/lib/widget-manager-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Slider } from "~/components/ui/slider";

interface BackgroundModalProps {
  open: boolean;
  onClose: () => void;
}
/**
 * Component to change the background of the current page.
 * It allows users to select from preset backgrounds or upload their own image.
 * It also provides an overlay opacity slider to adjust the darkness of the background.
 */

export default function BackgroundModal({
  open,
  onClose,
}: BackgroundModalProps) {
  const [selectedBackground, setSelectedBackground] = useState<string | null>(
    null,
  );
  const [showAll, setShowAll] = useState(false);
  const { currentPageId, updatePageBackground } = useWidgetManager();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0); // 0-100 for bg-black/0 to bg-black/100

  // display 4 rooms by default
  const displayRooms = showAll ? initialRooms : initialRooms.slice(0, 4);

  const handleBackgroundSelect = (backgroundImage: string) => {
    setSelectedBackground(backgroundImage);
  };

  const handleApplyBackground = () => {
    if (selectedBackground) {
      // Pass both the background image and overlay opacity to the context
      updatePageBackground(currentPageId, selectedBackground, overlayOpacity);
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setSelectedBackground(imageUrl);

      // later upload the image to a server or cloud storage, and use server path
    }
  };

  const getOverlayClass = () => {
    const roundedOpacity = Math.round(overlayOpacity / 5) * 5;
    return `bg-black/${roundedOpacity}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Change Background
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preset">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Preset Backgrounds</TabsTrigger>
            <TabsTrigger value="upload">Upload Background</TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="mt-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {displayRooms.map((room) => (
                <div
                  key={room.id}
                  className={`relative aspect-video cursor-pointer overflow-hidden rounded-lg border-2 transition-all hover:opacity-90 ${selectedBackground === room.backgroundImage ? "border-blue-500 ring-2 ring-blue-300" : "border-transparent"}`}
                  onClick={() => handleBackgroundSelect(room.backgroundImage)}
                >
                  <Image
                    src={room.backgroundImage}
                    alt={room.name}
                    className="h-full w-full object-cover"
                    width={300}
                    height={169}
                  />

                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                    <p className="text-xs text-white">{room.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {!showAll && initialRooms.length > 4 && (
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => setShowAll(true)}
              >
                View More Backgrounds
              </Button>
            )}
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            <div className="flex flex-col items-center justify-center">
              {uploadedImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <Image
                    src={uploadedImage}
                    alt="Uploaded background"
                    className="h-full w-full object-cover"
                    width={640}
                    height={360}
                  />

                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => {
                      setUploadedImage(null);
                      setSelectedBackground(null);
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <Upload className="mb-2 h-8 w-8 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Overlay Opacity Control */}
        {selectedBackground && (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Overlay Darkness</label>
              <span className="text-xs text-gray-500">{overlayOpacity}%</span>
            </div>
            <Slider
              value={[overlayOpacity]}
              min={0}
              max={100}
              step={5}
              onValueChange={(values) => {
                if (values[0] !== undefined) {
                  setOverlayOpacity(values[0]);
                }
              }}
              className="py-2"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>Transparent</span>
              <span>Dark</span>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!selectedBackground}
            onClick={handleApplyBackground}
          >
            Apply Background
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
