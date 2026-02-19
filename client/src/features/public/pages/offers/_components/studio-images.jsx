"use client";

import { useGetStudio } from "@/apis/public/studio.api";
import { Loading } from "@/components/common";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function StudioImages() {
  // Fetch Studios
  const { data: studiosData, isLoading } = useGetStudio(true);

  // Collect all images
  const allStudiosImages = useMemo(() => {
    const images = [];
    studiosData?.data?.forEach((studio) => {
      if (studio.imagesGallery?.length) {
        images.push(...studio.imagesGallery);
      }
    });
    return images;
  }, [studiosData]);

  // Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: "trimSnaps",
    },
    [Autoplay({ delay: 3000 })],
  );

  // Navigation
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i) => emblaApi?.scrollTo(i), [emblaApi]);

  // Selected Slide
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (isLoading) return <Loading />;

  if (!allStudiosImages.length) {
    return <p className="text-center text-gray-400">No images available</p>;
  }

  return (
    <section className="w-full py-12">
      {/* Title */}
      <div className="mb-6 px-4 text-center sm:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl dark:text-white">
          Studio Gallery
        </h2>
        <div className="bg-main mx-auto mt-2 h-1 w-16 rounded-full sm:w-20" />
      </div>

      {/* Carousel Container */}
      <div className="relative w-full">
        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-1 sm:gap-2">
            {allStudiosImages.map((image, index) => {
              const isActive = index === selectedIndex;

              return (
                <div
                  key={index}
                  className="flex min-w-0 flex-[0_0_75%] items-center justify-center sm:flex-[0_0_42%] md:flex-[0_0_36%] lg:flex-[0_0_32%]"
                >
                  <div
                    className={`relative aspect-video w-full overflow-hidden rounded-3xl transition-all duration-500 ${
                      isActive ? "scale-105 opacity-100" : "scale-90 opacity-50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Studio ${index}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between px-4">
          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={scrollPrev}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110"
            >
              <ChevronLeft className="text-black" />
            </button>

            <button
              onClick={scrollNext}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110"
            >
              <ChevronRight className="text-black" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
