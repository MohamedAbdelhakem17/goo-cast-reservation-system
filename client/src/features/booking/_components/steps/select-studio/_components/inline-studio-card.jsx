import { motion } from "framer-motion";
import { AlertCircle, Check } from "lucide-react";
import { memo, useCallback } from "react";
import ImageCarousel from "./image-carousel";

const InlineStudioCard = memo(
  ({
    studio,
    selectedStudio,
    bookingData,
    lng,
    t,
    onSelect,
    onSelectAndNext,
    onPreview,
    liveViewMode,
    onToggleLiveView,
  }) => {
    const allImages = [...(studio.imagesGallery || [])];
    const isActive = selectedStudio === studio._id;
    const isAvailable =
      studio.is_available && studio.recording_seats >= bookingData.persons;

    const handleCardClick = useCallback(() => {
      if (isAvailable) {
        onSelect(studio);
      }
    }, [isAvailable, onSelect, studio]);

    const handleButtonClick = useCallback(
      (e) => {
        e.stopPropagation();
        if (isAvailable) {
          onSelectAndNext(studio);
        }
      },
      [isAvailable, onSelectAndNext, studio],
    );

    const handleToggleLiveViewForStudio = useCallback(() => {
      onToggleLiveView(studio._id);
    }, [onToggleLiveView, studio._id]);

    return (
      <motion.div
        key={studio._id}
        className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-lg transition-all duration-300 dark:bg-gray-900 ${
          isActive
            ? "border-main shadow-main/20 dark:shadow-main/40 border-2"
            : "border-gray-200 hover:shadow-xl dark:border-gray-700"
        }`}
        onClick={handleCardClick}
      >
        {/* {studio.isMostPopular && (
          <span
            className={`bg-main shadow-main dark:shadow-main/60 absolute -end-10 top-7 z-40 ${lng === "ar" ? "-rotate-45" : "rotate-45"} px-10 py-1 text-xs font-bold text-white shadow-md`}
          >
            {t("most-recommended")}
          </span>
        )} */}

        <ImageCarousel
          studio={studio}
          images={allImages}
          lng={lng}
          isLiveMode={liveViewMode[studio._id] || false}
          onToggleLiveView={handleToggleLiveViewForStudio}
          onPreview={onPreview}
        />

        <div className="flex flex-1 flex-col justify-between p-4">
          {!isAvailable && (
            <div className="group relative mx-auto mb-4 w-fit">
              {/* Alert Button */}
              <div className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 shadow-sm ring-1 ring-red-200 transition-all hover:shadow-md hover:ring-red-300 dark:bg-red-900/20 dark:ring-red-800 dark:hover:ring-red-700">
                <AlertCircle className="h-4 w-4 animate-pulse text-red-500 dark:text-red-400" />
                <span className="text-xs font-medium text-red-700 dark:text-red-300">
                  {t("studio-not-available")}
                </span>
              </div>

              {/* Modern Tooltip on Top */}
              <div className="pointer-events-none absolute -top-11 left-1/2 z-20 mb-2 -translate-x-1/2 scale-95 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                <div className="relative w-64 rounded-md bg-gray-800 px-3 py-2 text-center text-xs text-white shadow-lg dark:bg-gray-700">
                  {/* Arrow pointing down */}
                  <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-800 dark:bg-gray-700"></div>
                  {studio.recording_seats < bookingData.persons
                    ? t("not-enough-seats")
                    : t("studio-already-booked")}
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-main mb-3 text-lg font-bold dark:text-red-400">
              {studio.name?.[lng]}
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="font-medium">
                {studio.recording_seats} {t("recording-seats")}
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                {studio.address?.[lng]}
              </li>
              {studio.facilities?.[lng].map((text, i) => (
                <li key={i} className="text-gray-600 dark:text-gray-400">
                  • {text}
                </li>
              ))}
            </ul>
          </div>

          <motion.button
            whileHover={isAvailable ? { scale: 1.03 } : {}}
            whileTap={isAvailable ? { scale: 0.97 } : {}}
            onClick={handleButtonClick}
            className={`text-md mx-auto mt-6 flex w-full items-center justify-center rounded-lg px-4 py-3 font-semibold shadow-sm transition-all duration-200 ${
              !isAvailable
                ? "cursor-not-allowed border-2 border-gray-300 bg-gray-300 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
                : isActive
                  ? "bg-main dark:bg-main text-white shadow-md hover:bg-red-700 dark:hover:bg-red-600"
                  : "border-main text-main border-2 bg-white hover:bg-red-50 dark:border-red-500 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-950/30"
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
  },
);

InlineStudioCard.displayName = "InlineStudioCard";

export default InlineStudioCard;
