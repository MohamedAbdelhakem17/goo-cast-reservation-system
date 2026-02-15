import { OptimizedImage } from "@/components/common";
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
}) {
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
          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {availableStudiosData?.data?.map((studio) => {
              // Check if current studio is selected
              const isSelected = values?.studio?.id === studio._id;

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
                      src={studio.thumbnail}
                      alt={studio.name?.[lng]}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

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
                            <i className="fa-solid fa-dollar-sign text-xs text-green-300"></i>
                            <span className="text-xs font-medium text-white">
                              {studio.basePricePerSlot} / {t("slot", "Slot")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Facilities Preview */}
                      {studio.facilities?.[lng] && studio.facilities[lng].length > 0 && (
                        <div className="mb-2">
                          <p className="mb-1.5 text-xs font-semibold tracking-wide text-white/70 uppercase">
                            {t("facilities", "Facilities")}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {studio.facilities[lng].slice(0, 3).map((facility, idx) => (
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
        </div>
      )}
    </>
  );
}
