import { useGetAllPackages } from "@/apis/admin/manage-package.api";
import { OptimizedImage } from "@/components/common";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import usePriceFormat from "@/hooks/usePriceFormat";
import { tracking } from "@/utils/gtm";
import { motion } from "framer-motion";
import { Check, Dot, X } from "lucide-react";
import { memo } from "react";
import BookingLabel from "../../booking-label";

// ----------------------
// Animation Variants
// ----------------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
};

// ----------------------
// Recommendation Logic
// ----------------------
const getRecommendationLabel = (bestFor, persons, t) => {
  if (!bestFor || !persons) return null;

  if (persons === 1) {
    return bestFor === 1 ? t("most-recommended") : null;
  }

  if (persons > 1 && persons <= bestFor) {
    return t("most-recommended");
  }

  return null;
};

// ----------------------
// Sub components
// ----------------------
const InfoSection = memo(({ label, items, icon }) => {
  const { lng } = useLocalization();

  if (!items?.[lng]?.length) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {label && (
        <h6 className="mb-2 font-medium text-gray-900 dark:text-gray-100">{label}</h6>
      )}
      <ul className="space-y-4">
        {items[lng].map((benefit, idx) => (
          <motion.li
            key={idx}
            className="flex items-center gap-2 text-sm text-gray-600 last:pb-4 dark:text-gray-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
          >
            {icon || <Dot className="h-4 w-4 text-black" />}
            <span className="flex-1 text-pretty">{benefit}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
});
InfoSection.displayName = "InfoSection";

// ----------------------
// Package Card
// ----------------------
const PackageCard = memo(({ pkg, isActive, onSelect, persons }) => {
  const { t, lng } = useLocalization();
  const priceFormat = usePriceFormat();

  const recommendationLabel = getRecommendationLabel(+pkg.best_for, +persons, t);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5 }}
      className="col-span-1 cursor-pointer overflow-hidden px-1 py-5"
      onClick={() => onSelect(pkg)}
    >
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-gray-50 p-8 transition-colors duration-300 dark:bg-gray-800 ${
          isActive
            ? "border-main shadow-main/20"
            : "border-gray-100 shadow-sm dark:border-gray-700"
        }`}
      >
        {/* Most Recommended Badge */}
        {recommendationLabel && (
          <span
            className={`bg-main shadow-main dark:shadow-main/60 absolute -end-10 top-7 z-40 ${lng === "ar" ? "-rotate-45" : "rotate-45"} px-10 py-1 text-xs font-bold text-white shadow-md`}
          >
            {recommendationLabel}
          </span>
        )}
        {/* Header */}
        <div
          className={`flex flex-col items-start gap-4 ${recommendationLabel ? "mt-6" : ""}`}
        >
          {pkg.show_image && (
            <OptimizedImage
              src={pkg.image}
              alt={pkg.name?.[lng]}
              className="h-72 w-full rounded-t-2xl object-cover"
            />
          )}

          <h5 className="text-main line-clamp-2 max-w-[14rem] overflow-hidden text-2xl font-bold break-words">
            {pkg.name?.[lng]}
          </h5>

          <p className="my-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {priceFormat(pkg.price)}
            <span className="ms-1 text-sm font-normal text-gray-600 dark:text-gray-400">
              / {t("hour")}
            </span>
          </p>
        </div>

        {/* Description */}
        <motion.p
          className="my-2.5 line-clamp-3 overflow-hidden border-b border-gray-300 pb-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {pkg.description?.[lng]}
        </motion.p>

        {/* Info Sections */}
        <div className="space-y-4 py-2">
          <div className="border-b border-gray-300 pb-3 dark:border-gray-700">
            <InfoSection
              label={t("whats-included")}
              items={pkg.details}
              icon={
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                  <Check className="h-3 w-3 text-white" />
                </div>
              }
            />
            <InfoSection
              items={pkg.not_included}
              icon={
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                  <X className="h-3 w-3 text-white" />
                </div>
              }
            />
          </div>

          <div className="pb-3 dark:border-gray-700">
            <InfoSection
              label={t("after-your-session")}
              items={pkg.post_session_benefits}
              icon={
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                  <Check className="h-3 w-3 text-white" />
                </div>
              }
            />
            <InfoSection
              items={pkg.not_included_post_session_benefits}
              icon={
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                  <X className="h-3 w-3 text-white" />
                </div>
              }
            />
          </div>
        </div>

        {/* Action */}
        <div className="mt-auto px-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(pkg, true);
            }}
            className={`text-md mx-auto mt-6 flex w-full items-center justify-center rounded-lg px-4 py-3 font-semibold transition ${
              isActive ? "bg-main text-white" : "border-main text-main border-2 bg-white"
            }`}
          >
            {isActive ? (
              <>
                <Check className="me-2 h-4 w-4" /> {t("next")}
              </>
            ) : (
              t("book")
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});
PackageCard.displayName = "PackageCard";

// ----------------------
// Main Component
// ----------------------
export default function SelectPackage() {
  const { t } = useLocalization();
  const { packages } = useGetAllPackages(true);
  const { setBookingField, handleNextStep, bookingData, formik } = useBooking();
  const { addToast } = useToast();

  const selectedPackageId = bookingData.selectedPackage?.id || null;

  const handleSelect = (pkg, next = false) => {
    setBookingField("selectedPackage", {
      id: pkg._id,
      name: pkg.name,
      category: pkg.category._id,
      slug: pkg.category.slug,
      price: pkg.price,
    });

    setBookingField(
      "totalPackagePrice",
      Number(pkg.price) * Number(bookingData?.duration),
    );

    formik.setFieldTouched("selectedPackage", true);

    tracking("add-package", {
      package_name: pkg.name?.[bookingData.lng],
      price: pkg.price,
    });

    if (next) {
      addToast("Package selected successfully", "success", 1000);
      handleNextStep();
    }
  };

  return (
    <>
      <BookingLabel
        title={t("choose-your-service")}
        desc={t("select-the-type-of-recording-session-you-need")}
      />

      <motion.div
        className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 md:px-8 lg:grid-cols-3 lg:px-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {packages?.data?.map((pkg) => (
          <PackageCard
            key={pkg._id}
            pkg={pkg}
            isActive={selectedPackageId === pkg._id}
            onSelect={handleSelect}
            persons={bookingData?.persons}
          />
        ))}
      </motion.div>
    </>
  );
}
