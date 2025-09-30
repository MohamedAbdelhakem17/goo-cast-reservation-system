import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import BookingLabel from "../../booking-label";
import { tracking } from "@/utils/gtm";
import { Loading, ErrorFeedback, OptimizedImage } from "@/components/common";
import ImagePreviewModal from "./_components/image-preview-modal";
import { useGetStudio } from "@/apis/public/studio.api";
import useLocalization from "@/context/localization-provider/localization-context";

export default function SelectStudio() {
<<<<<<< HEAD:client/src/components/Booking/Select-Studio/SelectStudio.jsx
  const { setBookingField, bookingData, handleNextStep } = useBooking();
  const [selectedStudio, setSelectedStudio] = useState(
    bookingData?.studio?.id || null
  );
=======
  const { t, lng } = useLocalization();
  const { setBookingField, bookingData, handleNextStep } = useBooking();
  const [selectedStudio, setSelectedStudio] = useState(bookingData?.studio?.id || null);
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-studio/select-studio.jsx

  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);

  const { data: studiosData, isLoading, error } = useGetStudio();

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

  useEffect(() => {
    tracking("view_content");
  }, []);

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

<<<<<<< HEAD:client/src/components/Booking/Select-Studio/SelectStudio.jsx
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studiosData.data.map((studio) => (
            <motion.div
              key={studio.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-shadow duration-300 cursor-pointer border border-gray-100
        ${selectedStudio === studio._id ? "border-main/50 scale-[.98]" : ""}
      `}
=======
        <div className="flex scale-90 flex-wrap justify-around gap-3">
          {studiosData.data.map((studio) => (
            <motion.div
              key={studio.id}
              className={`w-full cursor-pointer overflow-hidden rounded-2xl border-1 border-gray-100 bg-white shadow-sm transition-shadow duration-300 md:w-[40%] ${
                selectedStudio === studio._id ? "border-main/50 scale-[.98]" : ""
              }`}
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-studio/select-studio.jsx
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 300 },
              }}
              onClick={() => {
                selectStudio({
                  id: studio._id,
                  name: studio.name?.[lng],
                  image: studio.thumbnail,
                });
<<<<<<< HEAD:client/src/components/Booking/Select-Studio/SelectStudio.jsx
=======
                tracking("add_to_cart", { studio_name: studio.name?.[lng] });
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-studio/select-studio.jsx
              }}
            >
              {/* Image with Click Indicator */}
              <motion.div
                className="group relative h-64 overflow-hidden p-5"
                onMouseEnter={() => setHoveredImage(studio._id)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                {selectedStudio === studio._id && (
                  <div className="bg-main absolute top-8 right-8 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white">
                    <i className="fa-solid fa-check"></i>
                  </div>
                )}

                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  <OptimizedImage
                    src={studio.thumbnail || "/placeholder.svg"}
                    alt={studio.name?.[lng]}
                    className="h-full w-full cursor-zoom-in object-cover transition-transform duration-300 group-hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      const images = [studio.thumbnail, ...(studio.imagesGallery || [])];
                      setPreviewImages(images);
                      setPreviewIndex(0);
                    }}
                  />

                  {/* Hover Overlay with Click Indicator */}
                  <AnimatePresence>
                    {hoveredImage === studio._id && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className="flex items-center gap-2 rounded-full bg-white/90 p-3 text-gray-800 backdrop-blur-sm"
                          initial={{ scale: 0.8, y: 10 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.8, y: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const images = [
                              studio.thumbnail,
                              ...(studio.imagesGallery || []),
                            ];
                            setPreviewImages(images);
                            setPreviewIndex(0);
                          }}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                          </svg>
                          <span className="text-sm font-medium">{t("view-gallery")}</span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Small indicator in corner */}
                  <div className="absolute top-3 left-3 rounded-full bg-white/80 p-1.5 opacity-70 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <svg
                      className="h-3 w-3 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800">{studio.name?.[lng]}</h3>
                <ul className="mt-3 text-gray-600">
                  <li className="flex items-start text-sm">
                    <span
<<<<<<< HEAD:client/src/components/Booking/Select-Studio/SelectStudio.jsx
                      className={`mr-2 ${
                        selectedStudio === studio._id
                          ? "text-main"
                          : "text-black"
=======
                      className={`me-2 ${
                        selectedStudio === studio._id ? "text-main" : "text-black"
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-studio/select-studio.jsx
                      }`}
                    >
                      •
                    </span>
                    {studio.recording_seats} {t("recording-seats")}
                  </li>
                  <li className="flex items-start text-sm">
                    <span
<<<<<<< HEAD:client/src/components/Booking/Select-Studio/SelectStudio.jsx
                      className={`mr-2 ${
                        selectedStudio === studio._id
                          ? "text-main"
                          : "text-black"
=======
                      className={`me-2 ${
                        selectedStudio === studio._id ? "text-main" : "text-black"
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-studio/select-studio.jsx
                      }`}
                    >
                      •
                    </span>
                    {studio.address?.[lng]}
                  </li>
                </ul>
                <ul className="mb-4 space-y-2">
                  {studio.facilities?.[lng].map((text, i) => (
                    <motion.li
                      key={i}
                      variants={benefitVariants}
                      className="flex items-start text-sm"
                    >
                      <span
<<<<<<< HEAD:client/src/components/Booking/Select-Studio/SelectStudio.jsx
                        className={`mr-2 ${
                          selectedStudio === studio._id
                            ? "text-main"
                            : "text-black"
=======
                        className={`me-2 ${
                          selectedStudio === studio._id ? "text-main" : "text-black"
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-studio/select-studio.jsx
                        }`}
                      >
                        •
                      </span>
                      {text}
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      selectStudio({
                        id: studio._id,
                        name: studio.name?.[lng],
                        image: studio.thumbnail,
                      });
                      handleNextStep();
                    }}
<<<<<<< HEAD:client/src/components/Booking/Select-Studio/SelectStudio.jsx
                    className={`w-full py-2 px-4 rounded-lg mx-auto text-md font-semibold flex items-center justify-center ${
                      selectedStudio === studio._id
                        ? "bg-main text-white"
                        : "border-gray-200 border-2 text-gray-700 hover:bg-gray-200"
=======
                    className={`text-md mx-auto flex w-full items-center justify-center rounded-lg px-4 py-2 font-semibold ${
                      selectedStudio === studio._id
                        ? "bg-main text-white"
                        : "border-2 border-gray-200 text-gray-700 hover:bg-gray-200"
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-studio/select-studio.jsx
                    }`}
                  >
                    {selectedStudio === studio._id ? t("selected-0") : t("select")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
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
