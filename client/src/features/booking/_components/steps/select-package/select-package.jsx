"use client";
import { useState, memo } from "react";
import { motion } from "framer-motion";
import { Check, Dot } from "lucide-react";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import useLocalization from "@/context/localization-provider/localization-context";
import { useGetAllPackages } from "@/apis/admin/manage-package.api";
import usePriceFormat from "@/hooks/usePriceFormat";
import { tracking } from "@/utils/gtm";
import { OptimizedImage } from "@/components/common";
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
// Sub components
// ----------------------
const InfoSection = memo(({ label, items }) => {
  const { lng } = useLocalization();

  if (!items?.[lng]?.length) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h4 className="mb-2 text-sm font-semibold text-gray-900">{label}:</h4>
      <ul className="space-y-2">
        {items[lng].map((benefit, idx) => (
          <motion.li
            key={idx}
            className="flex items-start gap-2 text-sm text-gray-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
          >
            <Dot className="mt-0.5 h-4 w-4 text-black" />
            <span>{benefit}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
});
InfoSection.displayName = "InfoSection";

// ----------------------
// Package Card Component
// ----------------------
const PackageCard = memo(({ pkg, isActive, onSelect }) => {
  const { t, lng } = useLocalization();
  const priceFormat = usePriceFormat();

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5 }}
      className="w-full cursor-pointer md:w-5/12"
      onClick={() => onSelect(pkg)}
    >
      <div
        className={`flex h-full flex-col overflow-hidden rounded-3xl border bg-gray-50 p-2 transition-colors duration-300 md:p-4 ${
          isActive ? "border-main shadow-main/20 border-2" : "border-gray-100 shadow-sm"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col items-start gap-2">
          {/* Image  */}
          <OptimizedImage
            src={pkg.image}
            alt={pkg.name?.[lng]}
            className="h-72 w-full rounded-t-2xl object-cover"
          />
          {/* Name */}
          <h5 className="text-main text-2xl font-bold">{pkg.name?.[lng]}</h5>

          {/* Price */}
          <p className={`text-color text-3xl font-bold`}>
            {/* Number */}
            {priceFormat(pkg.price)}

            {/* Icon */}
            <span className="ms-1 inline-block text-sm font-normal text-gray-600">
              / {t("hour")}
            </span>
          </p>
        </div>

        {/* Description */}
        <motion.p
          className="my-2.5 text-sm font-normal text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {pkg.description?.[lng]}
        </motion.p>

        {/* Info Sections */}
        <div className="space-y-2.5 py-2">
          <InfoSection label={t("whats-included")} items={pkg.details} />

          <InfoSection
            label={t("after-your-session")}
            items={pkg.post_session_benefits}
          />
        </div>
        {/* Action Button */}
        <div className="mt-auto px-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(pkg, true);
            }}
            className={`text-md mx-auto mt-6 flex w-full items-center justify-center rounded-lg px-4 py-3 font-semibold transition ${
              isActive
                ? "bg-main text-white"
                : "border-2 border-gray-200 bg-black text-white"
            }`}
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
      </div>
    </motion.div>
  );
});
PackageCard.displayName = "PackageCard";

// ----------------------
// Main Component
// ----------------------
export default function SelectPackage() {
  const { t, lng } = useLocalization();
  const { packages } = useGetAllPackages(true);
  const { setBookingField, handleNextStep, bookingData } = useBooking();

  const [selectedPackage, setSelectedPackage] = useState(
    bookingData.selectedPackage?.id || null,
  );

  const handleSelect = (pkg, next = false) => {
    setSelectedPackage(pkg._id);

    setBookingField("selectedPackage", {
      id: pkg._id,
      name: pkg.name,
      category: pkg.category._id,
      slug: pkg.category.slug,
      price: pkg.price,
    });

    tracking("add_to_cart", { package_name: pkg.name?.[lng], price: pkg.price });

    // reset dependent fields
    ["startSlot", "endSlot", "studio"].forEach((f) => setBookingField(f, null));

    if (next) handleNextStep();
  };

  return (
    <>
      <BookingLabel
        title={t("choose-your-service")}
        desc={t("select-the-type-of-recording-session-you-need")}
      />

      <motion.div
        className="flex scale-x-90 flex-wrap justify-center gap-2 md:px-8 lg:justify-around lg:px-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {packages?.data?.map((pkg) => (
          <PackageCard
            key={pkg._id}
            pkg={pkg}
            isActive={selectedPackage === pkg._id}
            onSelect={handleSelect}
          />
        ))}
      </motion.div>
    </>
  );
}

/* 4,000 */
