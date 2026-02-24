// Import necessary dependencies
import { useGetAddons } from "@/apis/admin/manage-addons.api";
import RecommendationBadge from "@/components/booking/recommendation-badge";
import RecommendationReason from "@/components/booking/recommendation-reason";
import { Loading } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import useAddonRecommendations from "@/hooks/use-addon-recommendations";
import { useAddOnsManager } from "@/hooks/use-addons-manger";
import usePriceFormat from "@/hooks/usePriceFormat";
import { motion } from "framer-motion";
import OfferSectionTitle from "./offer-section-title";

/**
 * Animation variants for the addon container
 * Creates a staggered fade-in effect for child elements
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Faster stagger for smoother animation
      delayChildren: 0.05,
    },
  },
};

/**
 * Animation variants for individual addon cards
 * Provides smooth entrance with spring physics
 */
const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

/**
 * OfferAddOns Component
 * Displays available addons for booking offers with recommendations
 *
 * @param {Object} bookingData - Current booking data including selected addons
 * @param {Function} setBookingField - Function to update booking fields
 */
export default function OfferAddOns({ bookingData, setBookingField }) {
  // Localization hook for translations and language
  const { t, lng } = useLocalization();

  // Fetch all active addons from the API
  const { addons, isLoading } = useGetAddons(true);

  // Addon management functions for cart operations
  const { handleIncrement, handleDecrement, handleRemove, getQuantity } =
    useAddOnsManager({
      bookingData,
      setBookingField,
      addons,
      tracking: true,
      lng,
    });

  // Price formatting hook for consistent currency display
  const priceFormat = usePriceFormat();

  // Separate addons into recommended and regular categories
  const { recommended, regular } = useAddonRecommendations({
    addons,
    bookingData,
    t,
    lng,
  });

  // Show loading state while fetching addons
  if (isLoading) return <Loading />;

  /**
   * Renders an individual addon card with all its features
   *
   * @param {Object|Recommendation} recommendation - Addon or recommendation object
   * @param {boolean} showRecommendation - Whether to show recommendation badge/reason
   */
  const renderAddonCard = (recommendation, showRecommendation = false) => {
    // Extract addon from recommendation or use directly
    const addon = recommendation.addon || recommendation;
    const quantity = getQuantity(addon._id);
    const isSelected = quantity > 0;
    const isDisabled = recommendation.isDisabled || false;
    const disabledReason = recommendation.disabledReason || null;

    return (
      <motion.div
        key={addon._id}
        variants={cardVariants}
        className={`flex flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 ${
          isDisabled
            ? "cursor-not-allowed border-gray-200 opacity-60 dark:border-gray-600"
            : "hover:-translate-y-1 hover:shadow-lg"
        } ${
          isSelected && !isDisabled
            ? "border-main shadow-main/20 ring-main/10 ring-2"
            : "border-gray-200 dark:border-gray-700"
        } dark:bg-gray-800`}
      >
        {/* Addon Image Section */}
        <div className="group relative aspect-[16/9] w-full overflow-hidden p-1.5">
          {/* Disabled Overlay - Shows when addon is already included */}
          {isDisabled && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0">
              <div className="px-2 text-center">
                <i className="fa-solid fa-circle-check mb-1.5 text-2xl text-green-400 drop-shadow-lg"></i>
                <p className="text-xs font-semibold text-white drop-shadow-lg">
                  {disabledReason}
                </p>
              </div>
            </div>
          )}

          {/* Recommendation Badge */}
          {showRecommendation && recommendation.badge && (
            <div className="absolute top-3 left-3 z-10">
              <RecommendationBadge
                text={recommendation.badge}
                variant={
                  recommendation.badge.includes(t("addon-badge-large-groups"))
                    ? "group"
                    : recommendation.badge.includes(t("addon-badge-popular-upgrade"))
                      ? "popular"
                      : recommendation.badge.includes(t("addon-badge-recommended-all"))
                        ? "universal"
                        : "default"
                }
              />
            </div>
          )}

          {/* Addon Image with smooth hover effect */}
          <img
            src={addon.image}
            alt={addon.name?.[lng]}
            className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Addon Content Section */}
        <div className="flex flex-grow flex-col gap-y-2 p-3">
          {/* Addon Name */}
          <h3 className="line-clamp-1 text-base font-semibold text-gray-900 dark:text-gray-100">
            {addon.name?.[lng]}
          </h3>

          {/* Addon Description */}
          <p className="line-clamp-2 flex-grow text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            {addon.description?.[lng]}
          </p>

          {/* Recommendation Reason (if applicable) */}
          {showRecommendation && recommendation.reason && (
            <RecommendationReason reason={recommendation.reason} />
          )}

          {/* Pricing Display */}
          <div className="flex w-fit items-center justify-center rounded-md bg-gray-50 px-2 py-1 text-sm font-bold text-gray-900 dark:bg-gray-700 dark:text-gray-100">
            {priceFormat(addon.price)}{" "}
            {addon.unit && (
              <span className="ms-1 text-xs font-normal text-gray-600 dark:text-gray-400">
                / {addon.unit}
              </span>
            )}
          </div>

          {/* Action Buttons Section */}
          <div className="mt-1">
            {/* Disabled State - Already Included in Package */}
            {isDisabled ? (
              <button
                className="w-full cursor-not-allowed rounded-md border-2 border-gray-300 bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-500"
                disabled
              >
                {t("included-in-package")}
              </button>
            ) : quantity === 0 ? (
              /* Add Button - Initial State */
              <button
                className="border-main hover:bg-main text-main w-full rounded-md border-2 bg-white px-3 py-1.5 text-sm font-semibold transition-all duration-200 hover:text-white hover:shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncrement(addon._id, addon.name, addon.price, addon.unit);
                }}
              >
                {t("add-to-cart")}
              </button>
            ) : (
              /* Quantity Controls - Active State */
              <div className="flex items-center justify-between py-1">
                {/* Quantity Adjuster */}
                <div className="flex items-center gap-1.5">
                  {/* Decrement Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecrement(addon._id, addon.name, addon.price, addon.unit);
                    }}
                    disabled={quantity === 0}
                  >
                    <i className="fa-solid fa-minus text-xs"></i>
                  </motion.button>

                  {/* Quantity Display */}
                  <span className="w-7 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {quantity}
                  </span>

                  {/* Increment Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIncrement(addon._id, addon.name, addon.price, addon.unit);
                    }}
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                  </motion.button>
                </div>

                {/* Remove Button */}
                <button
                  className="rounded-md border border-gray-300 px-2.5 py-1 text-xs text-gray-700 transition-colors hover:border-red-300 hover:bg-gray-100 hover:text-red-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(addon._id);
                  }}
                >
                  {t("remove")}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full space-y-8 px-2 sm:px-4 lg:px-0">
      {/* Recommended Addons Section */}
      {recommended && recommended.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <OfferSectionTitle
            title={t("addon-section-recommended")}
            info={t("select-recmmended-addon")}
          />
          {/* Grid layout - 4 columns on large screens for compact display */}
          <motion.div
            className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {recommended.map((rec) => renderAddonCard(rec, true))}
          </motion.div>
        </motion.div>
      )}

      {/* Regular/Other Addons Section */}
      {regular && regular.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <OfferSectionTitle
            title={
              recommended.length > 0 ? t("addon-section-other") : t("addon-section-all")
            }
            info={t("select-addon")}
          />
          {/* Grid layout - 4 columns on large screens for compact display */}
          <motion.div
            className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {regular.map((rec) => renderAddonCard(rec, false))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
