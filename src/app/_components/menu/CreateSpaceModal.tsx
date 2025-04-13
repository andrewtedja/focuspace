"use client";
import { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Check,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { initialRooms } from "~/data/rooms";

import Image from "next/image";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

interface CreateSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSpace: (space: {
    name: string;
    desc: string;
    backgroundImage: string;
  }) => void;
}
/**
 * Modal component for creating a new space.
 * It allows users to input a name, description, and select a background image.
 */
const CreateSpaceModal = ({
  isOpen,
  onClose,
  onCreateSpace,
}: CreateSpaceModalProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(
    "/images/spaces/placeholder/lofi.jpg",
  );
  const modalRef = useRef<HTMLDivElement>(null);

  const allBackgrounds = Array.from(
    new Set(initialRooms.map((room) => room.backgroundImage)),
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedImage(base64String); // ✅ actual base64
        setSelectedImage(base64String); // if you're using base64 as preview
        setSelectedFileName(file.name); // ✅ save the real filename
      };
      reader.readAsDataURL(file); // ✅ convert to base64
    }
  };

  // Pagination for background images
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 8;
  const totalPages = Math.ceil(allBackgrounds.length / (imagesPerPage - 1));
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const startIndex = currentPage * (imagesPerPage - 1);
  const displayedBackgrounds = allBackgrounds.slice(
    startIndex,
    startIndex + (imagesPerPage - 1),
  );
  const router = useRouter();
  const uploadImage = api.storage.uploadBase64.useMutation({
    onSuccess: (data) => {
      // Handle success, e.g., update the state or notify the user
      router.push("/room?id=7");
      console.log("Image uploaded successfully:", data);
    },
    onError: (error) => {
      // Handle error, e.g., show an error message
      console.error("Error uploading image:", error);
    },
  });

  // baru sample
  // const backgroundOptions = [
  //   "/images/spaces/placeholder/lofi.jpg",
  //   "/images/spaces/placeholder/room1.png",
  //   "/images/spaces/placeholder/cafe.jpg",
  //   "/images/spaces/placeholder/adhd-2.jpg",
  //   "/images/spaces/placeholder/traveler.png",
  // ];

  // Handle click outside to close
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // *  scroller prevention
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // onCreateSpace({
      //   name,
      //   desc: description,
      //   backgroundImage: selectedImage,
      // });

      if (uploadedImage && selectedFileName) {
        uploadImage.mutate({
          fileName: selectedFileName,
          base64: uploadedImage,
          type: "background",
        });
      }

      // ! reset form
      setName("");
      setDescription("");
      setSelectedImage("/images/spaces/placeholder/lofi.jpg");
      setStep(1);
      onClose();
    }
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[#f2f2f2] p-6 shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New Space</h2>
        </div>
        {/* Progress Steps */}
        <div className="mb-8 flex items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              step > 1 ? "bg-emerald-500" : "bg-emerald-500"
            } text-white`}
          >
            {step > 1 ? <Check size={20} /> : "1"}
          </div>
          <div className="mx-2 h-1 w-16 bg-gray-200">
            <div
              className={`h-full transition-all duration-300 ${
                step > 1 ? "w-full bg-emerald-500" : "w-0"
              }`}
            />
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              step === 2
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            2
          </div>
        </div>
        {/* connect ama backend form later */}

        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            // Step 1
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Space Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Focus Space"
                  className="w-full rounded-xl border-0 bg-gray-50 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition-all placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will you use this space for?"
                  className="h-32 w-full rounded-xl border-0 bg-gray-50 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition-all placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          ) : (
            // Step 2
            <div className="space-y-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Choose Background Image
                </label>
                <div className="text-sm text-gray-500">
                  Page {currentPage + 1} of {totalPages}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {displayedBackgrounds.map((image, index) => (
                  <div
                    // SELECTED IMAGE
                    key={index}
                    className={`relative aspect-video cursor-pointer overflow-hidden rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 ${
                      selectedImage === image
                        ? "ring-2 ring-[#45a169] ring-offset-2"
                        : "border border-gray-200"
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image}
                      alt={`Background option ${startIndex + index + 1}`}
                      className="h-full w-full object-cover text-xs"
                      width={120}
                      height={80}
                    />
                    {selectedImage === image && (
                      <div className="absolute right-1 top-1 rounded-full bg-[#45a169] p-1 text-white">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                ))}

                {/* ! Upload Image */}
                <div
                  className="relative flex aspect-video cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-600 bg-gray-50 hover:bg-gray-100"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center text-center">
                    <Upload size={20} className="mb-1 text-gray-600" />
                    <span className="text-xs text-gray-600">Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="mt-3 flex justify-center space-x-2">
                  <button
                    type="button"
                    onClick={goToPrevPage}
                    disabled={currentPage === 0}
                    className="rounded-full p-1 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages - 1}
                    className="rounded-full p-1 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}

              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700">
                  Selected Preview
                </div>
                <div className="mt-2 aspect-video overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={selectedImage}
                    alt="Selected background"
                    className="h-full w-full object-cover"
                    width={400}
                    height={225}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-full px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Back
              </button>
            )}

            <button
              type="submit"
              disabled={uploadImage.isPending}
              className="flex items-center justify-center rounded-full bg-gradient-to-r from-[#86B3D1] to-[#7EB6A4] px-6 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
            >
              {step === 1 ? (
                <>
                  Next
                  <ArrowRight size={16} className="ml-1" />
                </>
              ) : (
                "Create Space"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSpaceModal;
