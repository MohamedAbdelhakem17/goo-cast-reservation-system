import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import BookingLabel from "../../booking-label";
import { tracking } from "@/utils/gtm";
import { Loading, ErrorFeedback, OptimizedImage } from "@/components/common";
import ImagePreviewModal from "./_components/image-preview-modal";
import { useGetStudio } from "@/apis/public/studio.api";
import useLocalization from "@/context/localization-provider/localization-context";

export default function SelectStudio() {
  const { t, lng } = useLocalization();
  const { setBookingField, bookingData, handleNextStep } = useBooking();
  const [selectedStudio, setSelectedStudio] = useState(bookingData?.studio?.id || null);

  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const { data: studiosData, isLoading, error } = useGetStudio(true);

  useEffect(() => {
    if (!studiosData?.data) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const newIndices = { ...prev };
        studiosData.data.forEach((studio) => {
          const allImages = [studio.thumbnail, ...(studio.imagesGallery || [])];
          const imageCount = allImages.length;
          const currentIndex = prev[studio._id] || 0;
          newIndices[studio._id] = (currentIndex + 1) % imageCount;
        });
        return newIndices;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [studiosData]);

  const selectStudio = (studio) => {
    setBookingField("studio", studio);
    setBookingField("startSlot", null);
    setBookingField("duration", 1);
    setBookingField("endSlot", null);
    setSelectedStudio(studio.id);
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const benefitVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setPreviewIndex((prev) => (prev === previewImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setPreviewIndex((prev) => (prev === 0 ? previewImages.length - 1 : prev - 1));
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
      <>
        <BookingLabel
          title={t("choose-your-studio")}
          desc={t("select-the-studio-that-best-fits-your-needs")}
        />

        <div className="flex flex-col gap-6">
          {studiosData.data.map((studio) => {
            const allImages = [studio.thumbnail, ...(studio.imagesGallery || [])];
            const isActive = selectedStudio === studio._id;

            return (
              <motion.div
                key={studio._id}
                className={`flex cursor-pointer flex-col-reverse items-start justify-between overflow-hidden rounded-2xl border bg-gray-50 p-2 shadow-lg transition-colors duration-300 md:flex-row ${
                  isActive ? "border-main border-2" : "border-gray-100 shadow-sm"
                }`}
                variants={itemVariants}
                onClick={() => {
                  selectStudio({
                    id: studio._id,
                    name: studio.name,
                    image: studio.thumbnail,
                  });
                  tracking("add_to_cart", { studio_name: studio.name?.[lng] });
                }}
              >
                {/* Left side - Text content */}
                <div className="flex min-h-96 w-full flex-col justify-between p-2 md:w-1/2 md:p-4">
                  <div>
                    <h3 className="mb-6 text-2xl font-bold text-red-600">
                      {studio.name?.[lng]}
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start text-sm">
                        <span className="me-2 text-gray-800">•</span>
                        {studio.recording_seats} {t("recording-seats")}
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="me-2 text-gray-800">•</span>
                        {studio.address?.[lng]}
                      </li>
                      {studio.facilities?.[lng].map((text, i) => (
                        <motion.li
                          key={i}
                          variants={benefitVariants}
                          className="flex items-start text-sm"
                        >
                          <span className="me-2 text-gray-800">•</span>
                          {text}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                        : "border-2 border-gray-200 bg-black text-white"
                    }`}
                  >
                    {isActive ? t("selected-0") : t("select")}
                  </motion.button>
                </div>

                {/* Right side - Image */}
                <div className="relative w-full overflow-hidden p-2 md:w-1/2 md:p-4">
                  {/* ✅ Swipe فقط على الصورة */}
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, info) => {
                      const delta = info.offset.x;
                      if (delta > 50) {
                        // Swipe Right
                        setCurrentImageIndex((prev) => ({
                          ...prev,
                          [studio._id]:
                            (prev[studio._id] || 0) === 0
                              ? allImages.length - 1
                              : (prev[studio._id] || 0) - 1,
                        }));
                      } else if (delta < -50) {
                        // Swipe Left
                        setCurrentImageIndex((prev) => ({
                          ...prev,
                          [studio._id]: ((prev[studio._id] || 0) + 1) % allImages.length,
                        }));
                      }
                    }}
                  >
                    <OptimizedImage
                      src={
                        allImages[currentImageIndex[studio._id] || 0] ||
                        "/placeholder.svg"
                      }
                      alt={studio.name?.[lng]}
                      className="h-96 w-full rounded-2xl object-cover select-none"
                    />
                  </motion.div>

                  {/* ✅ Clickable Dots */}
                  <div className="absolute right-0 -bottom-1.5 left-0 flex justify-center gap-2 py-2">
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
              </motion.div>
            );
          })}
        </div>
      </>

      {/* Modal */}
      <ImagePreviewModal
        previewImages={previewImages}
        previewIndex={previewIndex}
        setPreviewIndex={setPreviewIndex}
        nextImage={nextImage}
        prevImage={prevImage}
      />
    </div>
  );
}
