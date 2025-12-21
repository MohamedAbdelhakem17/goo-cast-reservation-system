import { useGetStudio } from "@/apis/public/studio.api";
import { ErrorFeedback, Loading, OptimizedImage } from "@/components/common";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import useLocalization from "@/context/localization-provider/localization-context";
import { tracking } from "@/utils/gtm";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import BookingLabel from "../../booking-label";
import ImagePreviewModal from "./_components/image-preview-modal";

export default function SelectStudio() {
  const { t, lng } = useLocalization();
  const { setBookingField, bookingData, handleNextStep } = useBooking();
  const [selectedStudio, setSelectedStudio] = useState(bookingData?.studio?.id || null);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const { data: studiosData, isLoading, error } = useGetStudio(true);

  const selectStudio = (studio) => {
    setBookingField("studio", studio);
    setBookingField("startSlot", null);
    setBookingField("duration", 1);
    setBookingField("endSlot", null);
    setSelectedStudio(studio.id);
  };

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

  if (isLoading) return <Loading />;
  if (error)
    return (
      <ErrorFeedback>
        {error.response?.data?.message || error.message || "Something went wrong"}
      </ErrorFeedback>
    );

  return (
    <div className="space-y-6">
      <BookingLabel
        title={t("choose-your-studio")}
        desc={t("select-the-studio-that-best-fits-your-needs")}
      />

      {/* ✅ Grid layout for responsiveness */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {studiosData.data.map((studio) => {
          const allImages = [studio.thumbnail, ...(studio.imagesGallery || [])];
          const isActive = selectedStudio === studio._id;

          return (
            <motion.div
              key={studio._id}
              className={`flex flex-col overflow-hidden rounded-2xl border bg-gray-50 shadow-md transition-colors duration-300 ${
                isActive ? "border-main border-2" : "border-gray-100"
              }`}
              onClick={() => {
                selectStudio({
                  id: studio._id,
                  name: studio.name,
                  image: studio.thumbnail,
                });
                tracking("add_to_cart", { studio_name: studio.name?.[lng] });
              }}
            >
              {/* Image with next/prev controls */}
              <div className="relative w-full overflow-hidden">
                <OptimizedImage
                  src={
                    allImages[currentImageIndex[studio._id] || 0] || "/placeholder.svg"
                  }
                  alt={studio.name?.[lng]}
                  className="h-64 w-full rounded-2xl object-cover p-2 select-none"
                />

                {/* ✅ Next / Prev buttons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage(studio._id, allImages);
                  }}
                  className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60"
                >
                  <ChevronLeft size={15} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage(studio._id, allImages);
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
                        setCurrentImageIndex((prev) => ({
                          ...prev,
                          [studio._id]: i,
                        }));
                      }}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        i === (currentImageIndex[studio._id] || 0)
                          ? "bg-main"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between p-4">
                <div>
                  <h3 className="mb-3 text-lg font-bold text-red-600">
                    {studio.name?.[lng]}
                  </h3>
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
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectStudio({
                      id: studio._id,
                      name: studio.name,
                      image: studio.thumbnail,
                    });
                    handleNextStep();
                  }}
                  className={`text-md mx-auto mt-6 flex w-full items-center justify-center rounded-lg px-4 py-3 font-semibold transition ${
                    isActive
                      ? "bg-main text-white"
                      : "border-main text-main border-2 bg-white"
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="mث-2 h-4 w-4" /> {t("next")}
                    </>
                  ) : (
                    t("book")
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Preview Modal */}
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
