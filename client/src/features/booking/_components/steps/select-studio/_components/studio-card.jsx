import { OptimizedImage } from "@/components/common";
import Image360Preview from "@/components/common/image-360.preview";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Images, Rotate3D, ZoomIn } from "lucide-react";
import { useState } from "react";

export default function StudioCard({
  studio,
  isActive,
  onSelect,
  setPreviewImages,
  setPreviewIndex,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiveMode, setIsLiveMode] = useState(false);

  const allImages = [studio.thumbnail, ...(studio.imagesGallery || [])];

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));

  const handlePreview = (e) => {
    e.stopPropagation();
    setPreviewImages(allImages);
    setPreviewIndex(currentIndex);
  };

  return (
    <motion.div
      className={`relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-gray-50 shadow-md transition-colors duration-300 ${
        isActive ? "border-main border-2" : "border-gray-100"
      }`}
      whileHover={{ scale: 1.02 }}
      onClick={() =>
        onSelect({
          id: studio._id,
          name: studio.name,
          image: studio.thumbnail,
          recording_seats: studio.recording_seats,
        })
      }
    >
      {studio.isMostPopular && (
        <span className="bg-main shadow-main absolute -end-10 top-7 rotate-45 px-10 py-1 text-xs font-bold text-white shadow-sm">
          Most Popular
        </span>
      )}

      {isLiveMode && studio.live_view ? (
        <div className="relative h-64 w-full">
          <div
            className="absolute start-2 top-2 z-10 cursor-pointer rounded-full bg-black/50 p-2 text-white hover:bg-black"
            onClick={() => setIsLiveMode(false)}
          >
            <Images className="h-5 w-5" />
          </div>
          <Image360Preview image={studio.live_view} />
        </div>
      ) : (
        <div className="group relative w-full overflow-hidden" onClick={handlePreview}>
          <OptimizedImage
            src={allImages[currentIndex] || "/placeholder.svg"}
            alt={studio.name?.en || "studio"}
            className="h-64 w-full rounded-2xl object-cover p-2 select-none"
            loading="lazy"
          />

          {/* Hover overlay */}
          <div className="absolute top-2 right-2 bottom-4 left-2 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <ZoomIn className="h-10 w-10 text-white" />
          </div>

          {/* 360 Badge */}
          {studio.live_view && (
            <span
              className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs text-white"
              onClick={(e) => {
                e.stopPropagation();
                setIsLiveMode(true);
              }}
            >
              <Rotate3D size={14} />
              360°
            </span>
          )}

          {/* Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60"
          >
            <ChevronRight size={15} />
          </button>

          {/* Dots */}
          <div className="absolute right-0 bottom-2 left-0 flex justify-center gap-2 p-3">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(i);
                }}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === currentIndex ? "bg-main" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="flex flex-col justify-between p-4">
        <div>
          <h3 className="mb-3 text-lg font-bold text-red-600">{studio.name?.en}</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>{studio.recording_seats} seats</li>
            <li>{studio.address?.en}</li>
            {studio.facilities?.en?.map((text, i) => (
              <li key={i}>• {text}</li>
            ))}
          </ul>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() =>
            onSelect(
              {
                id: studio._id,
                name: studio.name,
                image: studio.thumbnail,
                recording_seats: studio.recording_seats,
              },
              true,
            )
          }
          className={`text-md mx-auto mt-6 flex w-full items-center justify-center rounded-lg px-4 py-3 font-semibold transition ${
            isActive ? "bg-main text-white" : "border-main text-main border-2 bg-white"
          }`}
        >
          {isActive ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Next
            </>
          ) : (
            "Book"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
