import { motion } from "framer-motion";
import { AlertCircle, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { useGetAvailableStudios } from "@/apis/public/booking.api";
import { ErrorFeedback, Loading, OptimizedImage } from "@/components/common";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { tracking } from "@/utils/gtm";

import BookingLabel from "../../booking-label";
import ImagePreviewModal from "./_components/image-preview-modal";

export default function SelectStudio() {
  const { t, lng } = useLocalization();
  const { bookingData, setBookingField, handleNextStep } = useBooking();
  const { addToast } = useToast();

  const [selectedStudio, setSelectedStudio] = useState(bookingData?.studio?.id || null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);

  const {
    data: studiosData,
    isLoading,
    error,
  } = useGetAvailableStudios({
    date: bookingData.date,
    startSlot: bookingData.startSlot,
    duration: bookingData.duration,
  });

  // -----------------------------
  // Image Carousel Handlers
  // -----------------------------
  const nextImage = (id, images) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % images.length,
    }));
  };

  const prevImage = (id, images) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) === 0 ? images.length - 1 : (prev[id] || 0) - 1,
    }));
  };

  // -----------------------------
  // Studio Selection Handler
  // -----------------------------
  const selectStudio = (studio, next = false) => {
    setBookingField("studio", {
      id: studio._id,
      name: studio.name,
      image: studio.thumbnail,
      recording_seats: studio.recording_seats,
    });

    tracking("add-studio", { studio_name: studio.name?.[lng] });

    if (next) {
      addToast("studio selected successfully", "success", 1000);
      handleNextStep();
    }
    setSelectedStudio(studio._id);
  };

  // -----------------------------
  // Loading / Error States
  // -----------------------------
  if (isLoading) return <Loading />;
  if (error)
    return (
      <ErrorFeedback>
        {error.response?.data?.message || error.message || "Something went wrong"}
      </ErrorFeedback>
    );

  // -----------------------------
  // Studio Card Component
  // -----------------------------
  const StudioCard = ({ studio }) => {
    const allImages = [studio.thumbnail, ...(studio.imagesGallery || [])];
    const isActive = selectedStudio === studio._id;
    const isAvailable =
      studio.is_available && studio.recording_seats >= bookingData.persons;

    return (
      <motion.div
        key={studio._id}
        className={`relative flex flex-col overflow-hidden rounded-2xl border bg-gray-50 shadow-md transition-colors duration-300 ${
          isActive ? "border-main border-2" : "border-gray-100"
        }`}
        onClick={() => {
          if (isAvailable) {
            selectStudio(studio);
          }
        }}
      >
        {studio.isMostPopular && (
          <span className="bg-main shadow-main absolute -end-10 top-7 rotate-45 px-10 py-1 text-xs font-bold text-white shadow-sm">
            Most Popular
          </span>
        )}

        <ImageCarousel
          studio={studio}
          images={allImages}
          currentIndex={currentImageIndex[studio._id] || 0}
          nextImage={nextImage}
          prevImage={prevImage}
          setCurrentImageIndex={setCurrentImageIndex}
        />

        <div className="flex flex-1 flex-col justify-between p-4">
          {!isAvailable && (
            <div className="group relative mx-auto mb-4 w-fit">
              {/* Alert Button */}
              <div className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 shadow-sm ring-1 ring-red-200 transition-all hover:shadow-md hover:ring-red-300">
                <AlertCircle className="h-4 w-4 animate-pulse text-red-500" />
                <span className="text-xs font-medium text-red-700">
                  {t("studio-not-available")}
                </span>
              </div>

              {/* Modern Tooltip on Top */}
              <div className="pointer-events-none absolute -top-11 left-1/2 z-20 mb-2 -translate-x-1/2 scale-95 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                <div className="relative w-64 rounded-md bg-gray-800 px-3 py-2 text-center text-xs text-white shadow-lg">
                  {/* Arrow pointing down */}
                  <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-800"></div>
                  {studio.recording_seats < bookingData.persons
                    ? t("not-enough-seats")
                    : t("studio-already-booked")}
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 text-lg font-bold text-red-600">{studio.name?.[lng]}</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                {studio.recording_seats} {t("recording-seats")}
              </li>
              <li>{studio.address?.[lng]}</li>
              {studio.facilities?.[lng].map((text, i) => (
                <li key={i}>• {text}</li>
              ))}
            </ul>
          </div>

          <motion.button
            whileHover={isAvailable ? { scale: 1.03 } : {}}
            whileTap={isAvailable ? { scale: 0.97 } : {}}
            onClick={(e) => {
              e.stopPropagation();
              if (isAvailable) {
                selectStudio(studio, true);
              }
            }}
            className={`text-md mx-auto mt-6 flex w-full items-center justify-center rounded-lg px-4 py-3 font-semibold transition-all duration-200 ${
              !isAvailable
                ? "cursor-not-allowed border-2 border-gray-300 bg-gray-300 text-gray-500"
                : isActive
                  ? "bg-main text-white hover:bg-red-700"
                  : "border-main text-main border-2 bg-white hover:bg-red-50"
            }`}
            disabled={!isAvailable}
          >
            {isActive ? (
              <>
                <Check className="mr-2 h-4 w-4" /> {t("next")}
              </>
            ) : (
              t("book")
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // -----------------------------
  // Image Carousel Component
  // -----------------------------
  const ImageCarousel = ({ studio, images, currentIndex, nextImage, prevImage }) => {
    return (
      <div className="relative w-full overflow-hidden">
        <OptimizedImage
          src={images[currentIndex] || "/placeholder.svg"}
          alt={studio.name?.[lng]}
          className="h-64 w-full rounded-2xl object-cover p-2 select-none"
        />

        {/* Next / Prev buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevImage(studio._id, images);
          }}
          className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60"
        >
          <ChevronLeft size={15} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextImage(studio._id, images);
          }}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60"
        >
          <ChevronRight size={15} />
        </button>

        {/* Dots */}
        <div className="absolute right-0 bottom-2 left-0 flex justify-center gap-2 p-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => ({
                  ...prev,
                  [studio._id]: i,
                }));
              }}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === currentIndex ? "bg-main" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  // -----------------------------
  // Main Render
  // -----------------------------
  return (
    <div className="space-y-6">
      <BookingLabel
        title={t("choose-your-studio")}
        desc={t("select-the-studio-that-best-fits-your-needs")}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {studiosData?.data.map((studio) => (
          <StudioCard key={studio._id} studio={studio} />
        ))}
      </div>

      <ImagePreviewModal
        previewImages={previewImages}
        previewIndex={previewIndex}
        setPreviewIndex={setPreviewIndex}
        nextImage={() => {}}
        prevImage={() => {}}
      />
    </div>
  );
}
