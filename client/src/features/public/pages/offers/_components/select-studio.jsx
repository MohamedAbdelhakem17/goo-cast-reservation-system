import { OptimizedImage } from "@/components/common";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import OfferSectionTitle from "./offer-section-title";

/**
 * SelectStudio Component
 *
 * Displays a grid of available studios for booking selection with enhanced visuals.
 * Features include:
 * - Responsive grid layout (1 column mobile, 2 columns tablet/desktop)
 * - Interactive hover effects with smooth transitions
 * - Selected state indication with visual feedback
 * - Loading and error state handling
 * - Optimized images with lazy loading
 *
 * @param {Object} props - Component props
 * @param {Object} availableStudiosData - Studio data from API
 * @param {boolean} isLoadingAvailable - Loading state flag
 * @param {Object} errorAvailable - Error object if API request fails
 * @param {Object} values - Formik form values
 * @param {Function} setFieldValue - Formik field setter function
 * @param {Function} t - Translation function for i18n
 * @param {string} lng - Current language code
 */
export default function SelectStudio({
  availableStudiosData,
  isLoadingAvailable,
  errorAvailable,
  values,
  setFieldValue,
  t,
  lng,
  formik,
}) {
  // Track current image index for each studio
  const [imageIndices, setImageIndices] = useState({});
  // Track hover state for each studio to pause auto-scroll
  const [hoveredStudios, setHoveredStudios] = useState({});

  // Auto-scroll images every 3 seconds
  useEffect(() => {
    if (!availableStudiosData?.data?.length) return;

    const interval = setInterval(() => {
      availableStudiosData.data.forEach((studio) => {
        const allImages = [...(studio.imagesGallery || [])].filter(Boolean);

        // Only auto-scroll if there are multiple images and studio is not hovered
        if (allImages.length > 1 && !hoveredStudios[studio._id]) {
          setImageIndices((prev) => ({
            ...prev,
            [studio._id]: ((prev[studio._id] || 0) + 1) % allImages.length,
          }));
        }
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [availableStudiosData?.data, hoveredStudios]);

  const handlePrevImage = (e, studioId, imagesLength) => {
    e.stopPropagation();
    setImageIndices((prev) => ({
      ...prev,
      [studioId]: prev[studioId] > 0 ? prev[studioId] - 1 : imagesLength - 1,
    }));
  };

  const handleNextImage = (e, studioId, imagesLength) => {
    e.stopPropagation();
    setImageIndices((prev) => ({
      ...prev,
      [studioId]:
        (prev[studioId] || 0) + 1 >= imagesLength ? 0 : (prev[studioId] || 0) + 1,
    }));
  };

  const handleDotClick = (e, studioId, index) => {
    e.stopPropagation();
    setImageIndices((prev) => ({
      ...prev,
      [studioId]: index,
    }));
  };

  const handleMouseEnter = (studioId) => {
    setHoveredStudios((prev) => ({ ...prev, [studioId]: true }));
  };

  const handleMouseLeave = (studioId) => {
    setHoveredStudios((prev) => ({ ...prev, [studioId]: false }));
  };

  return (
    <>
      {/* Only render if studios are available */}
      {availableStudiosData?.data?.length > 0 && (
        <div className="space-y-6">
          {/* Section Header */}

          <OfferSectionTitle
            title={t("select-studio", "Select Studio")}
            info={t("select-studio-info", "Choose the perfect studio for your session")}
          />
          {/* Loading State */}
          {isLoadingAvailable && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse text-base text-gray-600 dark:text-gray-400">
                {t("loading", "Loading...")}
              </div>
            </div>
          )}

          {/* Error State */}
          {errorAvailable && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                {t("failed-to-load-studios", "Failed to load studios")}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingAvailable &&
            !errorAvailable &&
            availableStudiosData?.data?.length === 0 && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800/50">
                <p className="text-base text-gray-600 dark:text-gray-400">
                  {t("no-available-studios", "No available studios for this time")}
                </p>
              </div>
            )}

          {/* Studio Cards Grid - Larger cards with 2 columns on medium+ screens */}
          <div>
            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
              {availableStudiosData?.data?.map((studio) => {
                // Check if current studio is selected
                const isSelected = values?.studio?.id === studio._id;

                // Get all images for the studio
                const allImages = [
                  studio.thumbnail,
                  ...(studio.imagesGallery || []),
                ].filter(Boolean);
                const currentImageIndex = imageIndices[studio._id] || 0;

                return (
                  <button
                    key={studio._id}
                    type="button"
                    onClick={() =>
                      setFieldValue("studio", {
                        id: studio._id,
                        name: studio.name,
                        image: studio.thumbnail,
                        recording_seats: studio.recording_seats,
                      })
                    }
                    onMouseEnter={() => handleMouseEnter(studio._id)}
                    onMouseLeave={() => handleMouseLeave(studio._id)}
                    className={`group focus:ring-main/20 relative overflow-hidden rounded-3xl border-2 bg-white text-left shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl focus:ring-4 focus:outline-none dark:bg-slate-900 ${
                      isSelected
                        ? "border-main ring-main/30 scale-[0.98] ring-4"
                        : "hover:border-main/50 border-gray-200 dark:border-gray-700"
                    } `}
                  >
                    {/* Studio Image Container - Increased height for larger cards */}
                    <div className="relative h-[420px] w-full overflow-hidden">
                      {/* Optimized Studio Image */}
                      <OptimizedImage
                        src={allImages[currentImageIndex]}
                        alt={studio.name?.[lng]}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />

                      {/* Image Slider Controls - Only show if there are multiple images */}
                      {allImages.length > 1 && (
                        <>
                          {/* Previous Button */}
                          <button
                            type="button"
                            onClick={(e) =>
                              handlePrevImage(e, studio._id, allImages.length)
                            }
                            className="absolute start-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70 focus:ring-2 focus:ring-white/50 focus:outline-none dark:bg-white/20 dark:hover:bg-white/30"
                          >
                            <ChevronLeft size={20} />
                          </button>

                          {/* Next Button */}
                          <button
                            type="button"
                            onClick={(e) =>
                              handleNextImage(e, studio._id, allImages.length)
                            }
                            className="absolute end-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70 focus:ring-2 focus:ring-white/50 focus:outline-none dark:bg-white/20 dark:hover:bg-white/30"
                          >
                            <ChevronRight size={20} />
                          </button>

                          {/* Dot Indicators */}
                          <div className="absolute right-0 bottom-4 left-0 z-20 flex justify-center gap-2 px-3">
                            {allImages.map((_, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={(e) => handleDotClick(e, studio._id, index)}
                                className={`h-2.5 w-2.5 rounded-full transition-all ${
                                  index === currentImageIndex
                                    ? "bg-main w-8 dark:bg-red-400"
                                    : "bg-white/60 hover:bg-white/80 dark:bg-gray-400/60 dark:hover:bg-gray-400/80"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      {/* Gradient Overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                      {/* Hover Information Overlay - Shows on hover */}
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/80 to-black/40 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {/* Studio Name */}
                        <h3 className="mb-3 text-2xl font-bold text-white drop-shadow-2xl">
                          {studio.name?.[lng]}
                        </h3>

                        {/* Studio Address */}
                        {studio.address?.[lng] && (
                          <div className="mb-3 flex items-start gap-2">
                            <i className="fa-solid fa-location-dot mt-1 text-sm text-red-400"></i>
                            <p className="line-clamp-1 text-sm text-white/90">
                              {studio.address?.[lng]}
                            </p>
                          </div>
                        )}

                        {/* Studio Description */}
                        {studio.description?.[lng] && (
                          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-white/85">
                            {studio.description?.[lng]}
                          </p>
                        )}

                        {/* Studio Info Grid */}
                        <div className="mb-3 grid grid-cols-2 gap-3">
                          {/* Recording Seats */}
                          {studio.recording_seats && (
                            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur-sm">
                              <i className="fa-solid fa-users text-xs text-blue-300"></i>
                              <span className="text-xs font-medium text-white">
                                {studio.recording_seats} {t("seats", "Seats")}
                              </span>
                            </div>
                          )}

                          {/* Base Price */}
                          {studio.basePricePerSlot && (
                            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur-sm">
                              <span className="text-xs font-medium text-white">
                                {studio.basePricePerSlot}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Facilities Preview */}
                        {studio.facilities?.[lng] &&
                          studio.facilities[lng].length > 0 && (
                            <div className="mb-2">
                              <p className="mb-1.5 text-xs font-semibold tracking-wide text-white/70 uppercase">
                                {t("facilities", "Facilities")}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {studio.facilities[lng]
                                  .slice(0, 3)
                                  .map((facility, idx) => (
                                    <span
                                      key={idx}
                                      className="rounded-full bg-white/15 px-2.5 py-1 text-xs text-white/95 backdrop-blur-sm"
                                    >
                                      {facility}
                                    </span>
                                  ))}
                                {studio.facilities[lng].length > 3 && (
                                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                    +{studio.facilities[lng].length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                        {/* Equipment Preview */}
                        {studio.equipment?.[lng] && studio.equipment[lng].length > 0 && (
                          <div>
                            <p className="mb-1.5 text-xs font-semibold tracking-wide text-white/70 uppercase">
                              {t("equipment", "Equipment")}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {studio.equipment[lng].slice(0, 3).map((item, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-full bg-white/15 px-2.5 py-1 text-xs text-white/95 backdrop-blur-sm"
                                >
                                  {item}
                                </span>
                              ))}
                              {studio.equipment[lng].length > 3 && (
                                <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                  +{studio.equipment[lng].length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Studio Name Badge - Visible when not hovering */}
                      <div className="absolute right-0 bottom-0 left-0 p-6 transition-opacity duration-300 group-hover:opacity-0">
                        <h3 className="text-2xl font-bold tracking-wide text-white drop-shadow-2xl">
                          {studio.name?.[lng]}
                        </h3>

                        {/* Recording Seats Info */}
                        {studio.recording_seats && (
                          <p className="mt-2 text-sm text-white/90 drop-shadow-lg">
                            {studio.recording_seats} {t("seats", "seats")}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Selected Badge Indicator */}
                    {isSelected && (
                      <span className="border-main text-main dark:text-main absolute end-4 top-4 z-10 animate-pulse rounded-xl border-2 bg-white px-4 py-2 text-sm font-bold shadow-lg backdrop-blur-sm dark:bg-slate-900">
                        ✓ {t("selected", "Selected")}
                      </span>
                    )}

                    {/* Bottom Accent Bar - Animated indicator */}
                    <div
                      className={`bg-main absolute bottom-0 left-0 h-1.5 rounded-r-full transition-all duration-500 ease-out ${isSelected ? "w-full" : "w-0 group-hover:w-full"} `}
                    ></div>
                  </button>
                );
              })}
            </div>

            {/* Error Message */}
            {formik?.touched?.studio && formik?.errors?.studio && (
              <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.studio}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
