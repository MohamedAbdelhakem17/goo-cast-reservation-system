import { OptimizedImage } from "@/components/common/";
import Image360Preview from "@/components/common/image-360.preview";
import { ChevronLeft, ChevronRight, Images, Rotate3D, ZoomIn } from "lucide-react";
import { memo, useCallback, useState } from "react";

const ImageCarousel = memo(
  ({ studio, images, lng, isLiveMode, onToggleLiveView, onPreview }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const validCurrentIndex = currentIndex ?? 0;

    const nextImage = useCallback(
      (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
      },
      [images.length],
    );

    const prevImage = useCallback(
      (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      },
      [images.length],
    );

    const handleDotClick = useCallback((e, index) => {
      e.stopPropagation();
      setCurrentIndex(index);
    }, []);

    const handlePreviewClick = useCallback(
      (e) => {
        e.stopPropagation();
        onPreview(images, validCurrentIndex);
      },
      [images, validCurrentIndex, onPreview],
    );

    const handleToggleLiveView = useCallback(
      (e) => {
        e.stopPropagation();
        onToggleLiveView();
      },
      [onToggleLiveView],
    );

    return (
      <div className="relative w-full overflow-hidden">
        {isLiveMode && studio.live_view ? (
          <div className="relative h-64 w-full" onClick={(e) => e.stopPropagation()}>
            <div
              className="absolute start-2 top-2 z-10 cursor-pointer rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black dark:bg-white/20 dark:hover:bg-white/30"
              onClick={handleToggleLiveView}
            >
              <Images className="h-5 w-5" />
            </div>
            <Image360Preview image={studio.live_view} />
          </div>
        ) : (
          <div
            className="group relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800"
            onClick={handlePreviewClick}
          >
            <div className="h-64 w-full">
              <OptimizedImage
                src={images[validCurrentIndex] || images[0]}
                alt={studio.name?.[lng]}
                className="h-64 w-full rounded-2xl object-cover p-2 transition-opacity duration-300 select-none"
                loading="eager"
              />
            </div>

            {/* Hover overlay */}
            <div className="absolute top-2 right-2 bottom-4 left-2 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-black/60">
              <ZoomIn className="h-10 w-10 text-white" />
            </div>

            {/* 360 Badge */}
            {studio.live_view && (
              <span
                className="absolute start-3 top-3 z-20 flex cursor-pointer items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur-sm transition-all hover:bg-black/80 dark:bg-white/20 dark:hover:bg-white/30"
                onClick={handleToggleLiveView}
              >
                <Rotate3D size={14} />
                360°
              </span>
            )}

            {/* Next / Prev buttons */}
            <button
              onClick={prevImage}
              className="absolute start-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-black/60 dark:bg-white/20 dark:hover:bg-white/30"
            >
              <ChevronLeft size={15} />
            </button>

            <button
              onClick={nextImage}
              className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-black/60 dark:bg-white/20 dark:hover:bg-white/30"
            >
              <ChevronRight size={15} />
            </button>

            {/* Dots */}
            <div className="absolute right-0 bottom-2 left-0 flex justify-center gap-2 p-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => handleDotClick(e, i)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === validCurrentIndex
                      ? "bg-main dark:bg-red-400"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);

ImageCarousel.displayName = "ImageCarousel";

export default ImageCarousel;
