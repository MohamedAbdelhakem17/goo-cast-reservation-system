import { useGetStudio } from "@/apis/public/studio.api";
import { Loading } from "@/components/common";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export default function StudioImages() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Query
  const { data: studiosData, isLoading: loadingStudios } = useGetStudio(true);

  const allStudiosImages = useMemo(() => {
    const images = [];
    studiosData?.data?.forEach((studio) => {
      if (studio.imagesGallery && studio.imagesGallery.length > 0) {
        images.push(...studio.imagesGallery);
      }
    });
    return images;
  }, [studiosData]);

  if (loadingStudios) return <Loading />;

  if (!allStudiosImages || allStudiosImages.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No studio images available</p>
      </div>
    );
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === allStudiosImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? allStudiosImages.length - 1 : prevIndex - 1,
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Studio Gallery
        </h2>
        <div className="bg-main mx-auto mt-2 h-1 w-24 rounded-full"></div>
      </div>

      {/* Slider Container */}
      <div className="group relative">
        {/* Main Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-900 shadow-2xl">
          <img
            src={allStudiosImages[currentIndex]}
            alt={`Studio image ${currentIndex + 1}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="bg-main absolute top-1/2 left-4 -translate-y-1/2 rounded-full p-3 text-white opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:scale-110 hover:shadow-xl active:scale-95"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={goToNext}
            className="bg-main absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-3 text-white opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:scale-110 hover:shadow-xl active:scale-95"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Image Counter */}
          <div className="bg-main absolute right-4 bottom-4 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg">
            {currentIndex + 1} / {allStudiosImages.length}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="mt-6 flex items-center justify-center gap-3 overflow-x-auto px-1 pb-2">
          {allStudiosImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${
                index === currentIndex
                  ? "ring-main scale-110 shadow-lg ring-4 ring-offset-2"
                  : "opacity-60 hover:scale-105 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="mt-8 flex justify-center gap-2">
          {allStudiosImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-main h-3 w-8 shadow-lg"
                  : "h-3 w-3 bg-gray-300 hover:scale-125 hover:bg-gray-400"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
