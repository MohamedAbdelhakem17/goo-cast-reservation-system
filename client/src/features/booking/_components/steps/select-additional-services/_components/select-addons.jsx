import { useGetAddons } from "@/apis/admin/manage-addons.api";
import AddonSectionHeader from "@/components/booking/addon-section-header";
import RecommendationBadge from "@/components/booking/recommendation-badge";
import RecommendationReason from "@/components/booking/recommendation-reason";
import { Loading } from "@/components/common";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import useLocalization from "@/context/localization-provider/localization-context";
import useAddonRecommendations from "@/hooks/use-addon-recommendations";
import { useAddOnsManager } from "@/hooks/use-addons-manger";
import usePriceFormat from "@/hooks/usePriceFormat";
import { tracking } from "@/utils/gtm";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50 },
  },
};

export default function AddOns() {
  // Localization
  const { t, lng } = useLocalization();

  // Query
  const { addons, isLoading } = useGetAddons(true);

  // Hooks
  const { bookingData, setBookingField } = useBooking();

  const { handleIncrement, handleDecrement, handleRemove, getQuantity } =
    useAddOnsManager({
      bookingData,
      setBookingField,
      addons,
      tracking,
      lng,
    });

  const priceFormat = usePriceFormat();

  // Get recommendations
  const { recommended, regular } = useAddonRecommendations({
    addons,
    bookingData,
    t,
    lng,
  });

  if (isLoading) return <Loading />;

  // Helper function to render an addon card
  const renderAddonCard = (recommendation, showRecommendation = false) => {
    const addon = recommendation.addon || recommendation;
    const quantity = getQuantity(addon._id);
    const isSelected = quantity > 0;
    const isDisabled = recommendation.isDisabled || false;
    const disabledReason = recommendation.disabledReason || null;

    return (
      <motion.div
        key={addon._id}
        variants={cardVariants}
        className={`flex flex-col justify-between overflow-hidden rounded-2xl border bg-gray-50 shadow-sm transition-transform duration-300 ${
          isDisabled
            ? "cursor-not-allowed border-gray-200 opacity-60 dark:border-gray-600"
            : "hover:shadow-2xl"
        } ${
          isSelected && !isDisabled
            ? "border-main shadow-main/10"
            : "border-gray-100 dark:border-gray-700"
        } dark:bg-gray-800`}
      >
        {/* === Image === */}
        <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl p-2">
          {isDisabled && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0">
              <div className="text-center">
                <i className="fa-solid fa-circle-check mb-2 text-3xl text-green-400 drop-shadow-lg"></i>
                <p className="text-sm font-semibold text-white drop-shadow-lg">
                  {disabledReason}
                </p>
              </div>
            </div>
          )}
          {showRecommendation && recommendation.badge && (
            <div className="absolute top-4 left-4 z-10">
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
          <img
            src={addon.image}
            alt={addon.name?.[lng]}
            className="h-full w-full rounded-2xl object-cover transition-transform duration-300 hover:scale-95"
            loading="lazy"
          />
        </div>

        {/* === Info === */}
        <div className="flex flex-grow flex-col gap-y-3 p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-black dark:text-gray-100">
            {addon.name?.[lng]}
          </h3>

          {/* Description */}
          <p className="flex-grow text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {addon.description?.[lng]}
          </p>

          {/* Recommendation Reason */}
          {showRecommendation && recommendation.reason && (
            <RecommendationReason reason={recommendation.reason} />
          )}

          {/* Price */}
          <div className="text-md flex w-fit items-center justify-center rounded-lg p-1 font-bold text-gray-800 dark:text-gray-200">
            {priceFormat(addon.price)}
          </div>

          {/* === Actions === */}
          <div className="mt-2">
            {isDisabled ? (
              <button
                className="text-md w-full cursor-not-allowed rounded-lg border-2 border-gray-300 bg-gray-100 px-4 py-2 font-semibold text-gray-500"
                disabled
              >
                {t("included-in-package")}
              </button>
            ) : quantity === 0 ? (
              <button
                className="text-md border-main hover:bg-main text-main w-full rounded-lg border-2 bg-white px-4 py-2 font-semibold transition-all duration-200 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncrement(addon._id, addon.name, addon.price);
                }}
              >
                {t("add-to-cart")}
              </button>
            ) : (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecrement(addon._id, addon.name, addon.price);
                    }}
                    disabled={quantity === 0}
                  >
                    <i className="fa-solid fa-minus text-sm"></i>
                  </motion.button>

                  <span className="w-8 text-center font-medium text-gray-900 dark:text-gray-100">
                    {quantity}
                  </span>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIncrement(addon._id, addon.name, addon.price);
                    }}
                  >
                    <i className="fa-solid fa-plus text-sm"></i>
                  </motion.button>
                </div>

                <button
                  className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
      {/* Recommended Add-ons Section */}
      {recommended && recommended.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AddonSectionHeader
            title={t("addon-section-recommended")}
            icon="fa-solid fa-star"
            count={recommended.length}
          />
          <motion.div
            className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {recommended.map((rec) => renderAddonCard(rec, true))}
          </motion.div>
        </motion.div>
      )}

      {/* All Add-ons Section */}
      {regular && regular.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AddonSectionHeader
            title={
              recommended.length > 0 ? t("addon-section-other") : t("addon-section-all")
            }
            icon="fa-solid fa-grip"
            count={regular.length}
          />
          <motion.div
            className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2"
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
