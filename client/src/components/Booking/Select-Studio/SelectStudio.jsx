import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "../../../context/Booking-Context/BookingContext";
import Loading from "../../shared/Loading/Loading";
// import { useGetAvailableStudio } from "../../../apis/Booking/booking.api";
import NavigationButtons from "../Navigation-Buttons/NavigationButtons";
import BookingHeader from "../../shared/Booking-Header/BookingHeader";
import { trackEvent, trackBookingStep } from "../../../GTM/gtm";
import useGetAllStudios from "../../../apis/studios/studios.api";

export default function SelectStudio() {
  const { setBookingField, bookingData, handleNextStep, currentStep } = useBooking();
  const [selectedStudio, setSelectedStudio] = useState(
    bookingData?.studio?.id || null
  );

  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);

  const { data: studiosData, isLoading } = useGetAllStudios();

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
    setPreviewIndex((prev) =>
      prev === previewImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setPreviewIndex((prev) =>
      prev === 0 ? previewImages.length - 1 : prev - 1
    );
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <>
        <BookingHeader
          title="Choose Your Studio"
          desc="Select the studio that best fits your needs"
        />

        <div className="flex flex-wrap gap-3 justify-around scale-90">
          {studiosData.data.map((studio) => (
            <motion.div
              key={studio.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-shadow duration-300 cursor-pointer w-full md:w-[40%] border-1 border-gray-100  ${selectedStudio === studio._id
                ? "border-main/50 scale-[.98]"
                : ""
                }`}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 300 },
              }}
              onClick={() => {
                selectStudio({
                  id: studio._id,
                  name: studio.name,
                  image: studio.thumbnail,
                });
                trackEvent("select_studio", { studio_name: studio.name });
                trackBookingStep(currentStep, { totalPrice: bookingData.selectedPackage.price })
              }}
            >
              {/* Image with Click Indicator */}
              <motion.div
                className="relative h-64 p-5 overflow-hidden group"
                onMouseEnter={() => setHoveredImage(studio._id)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                {selectedStudio === studio._id && (
                  <div className="absolute z-10 flex items-center justify-center w-8 h-8 text-white rounded-full bg-main top-8 right-8">
                    <i className="fa-solid fa-check"></i>
                  </div>
                )}

                <div className="relative w-full h-full overflow-hidden rounded-lg">
                  <img
                    src={studio.thumbnail || "/placeholder.svg"}
                    alt={studio.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
                    onClick={(e) => {
                      e.stopPropagation();
                      const images = [
                        studio.thumbnail,
                        ...(studio.imagesGallery || []),
                      ];
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
                          className="flex items-center gap-2 p-3 text-gray-800 rounded-full bg-white/90 backdrop-blur-sm"
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
                            className="w-5 h-5"
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
                          <span className="text-sm font-medium">
                            View Gallery
                          </span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Small indicator in corner */}
                  <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-full p-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-3 h-3 text-gray-600"
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
                <h3 className="text-xl font-bold text-gray-800">
                  {studio.name}
                </h3>
                <ul className="mt-3 text-gray-600">
                  <li className="flex items-start text-sm">
                    <span
                      className={`mr-2 ${selectedStudio === studio._id
                        ? "text-main"
                        : "text-black"
                        }`}
                    >
                      •
                    </span>
                    {studio.recording_seats} Recording Seats
                  </li>
                  <li className="flex items-start text-sm">
                    <span
                      className={`mr-2 ${selectedStudio === studio._id
                        ? "text-main"
                        : "text-black"
                        }`}
                    >
                      •
                    </span>
                    {studio.address}
                  </li>
                </ul>
                <ul className="mb-4 space-y-2">
                  {studio.facilities.map((text, i) => (
                    <motion.li
                      key={i}
                      variants={benefitVariants}
                      className="flex items-start text-sm"
                    >
                      <span
                        className={`mr-2 ${selectedStudio === studio._id
                          ? "text-main"
                          : "text-black"
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
                        name: studio.name,
                        image: studio.thumbnail,
                      });
                      handleNextStep();
                    }}
                    className={`w-full py-2 px-4 rounded-lg mx-auto text-md font-semibold flex items-center justify-center ${selectedStudio === studio._id
                      ? "bg-main text-white"
                      : "border-gray-200 border-2 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {selectedStudio === studio._id ? "Selected" : "Select"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </>

      {/* Modal Preview */}
      <AnimatePresence>
        {previewIndex !== null && previewImages.length > 0 && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[600]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setPreviewIndex(null)}
          >
            <motion.img
              src={previewImages[previewIndex]}
              alt="Studio Preview"
              className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              onClick={(e) => e.stopPropagation()}
            />
            {/* Prev Button */}
            <button
              onClick={prevImage}
              className="absolute flex items-center justify-center w-10 h-10 text-2xl text-white rounded-full cursor-pointer left-10 bg-black/50 hover:bg-black/70"
            >
              &lt;
            </button>
            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute flex items-center justify-center w-10 h-10 text-2xl text-white rounded-full cursor-pointer right-10 bg-black/50 hover:bg-black/70"
            >
              &gt;
            </button>

            {/* Close button */}
            <button
              onClick={() => setPreviewIndex(null)}
              className="absolute flex items-center justify-center w-10 h-10 text-xl text-white rounded-full cursor-pointer top-5 right-5 bg-black/50 hover:bg-black/70"
            >
              ×
            </button>

            {/* Image counter */}
            <div className="absolute px-3 py-1 text-sm text-white transform -translate-x-1/2 rounded-full bottom-5 left-1/2 bg-black/50">
              {previewIndex + 1} / {previewImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
