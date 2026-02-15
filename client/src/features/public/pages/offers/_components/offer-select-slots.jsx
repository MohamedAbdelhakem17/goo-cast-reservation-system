import { SlotButton } from "@/components/booking";
import { EmptyState, Loading } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { calculateEndTime, calculateTotalPrice } from "@/hooks/useManageSlots";
import { TimerOff } from "lucide-react";
import OfferSectionTitle from "./offer-section-title";

export default function OfferSelectSlots({
  setFieldValue,
  values,
  isPending,
  slots,
  error,
  formik,
}) {
  const { t } = useLocalization();

  const handleSelectSlot = (time) => {
    const endTime = calculateEndTime(time, +values.duration);
    const totalPrice = calculateTotalPrice(
      +values.duration,
      +values?.selectedPackage?.price,
    );

    formik.setFieldTouched("studio", true);
    setFieldValue("startSlot", time);
    setFieldValue("endSlot", endTime);
    setFieldValue("totalPackagePrice", totalPrice);
  };

  // Loading state
  if (isPending) {
    return (
      <div className="space-y-4">
        <OfferSectionTitle
          title={t("select-time-slot", "Select Your Time Slot")}
          info={t("select-time-slot-info", "Choose your preferred starting time")}
        />
        <Loading />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <OfferSectionTitle
          title={t("select-time-slot", "Select Your Time Slot")}
          info={t("select-time-slot-info", "Choose your preferred starting time")}
        />
        <EmptyState
          message={t("failed-to-load-slots", "Failed to load available slots")}
          Icon={TimerOff}
        />
      </div>
    );
  }

  // Empty state
  if (!slots) return null;

  if (slots?.data.length === 0 && !values.startSlot) {
    return (
      <div className="space-y-4">
        <OfferSectionTitle
          title={t("select-time-slot", "Select Your Time Slot")}
          info={t("select-time-slot-info", "Choose your preferred starting time")}
        />
        <EmptyState
          message={t("no-available-slots", "No available time slots for this date")}
          Icon={TimerOff}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OfferSectionTitle
        title={t("select-time-slot", "Select Your Time Slot")}
        info={t("select-time-slot-info", "Choose your preferred starting time")}
      />

      {/* Slots Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {slots?.data.map((slot, index) => (
          <SlotButton
            key={index}
            time={slot.startTime}
            isSelected={values?.startSlot === slot.startTime}
            onClick={() => handleSelectSlot(slot.startTime)}
            index={index}
          />
        ))}
      </div>

      {/* Error Message */}
      {formik?.touched?.startSlot && formik?.errors?.startSlot && (
        <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            {formik.errors.startSlot}
          </p>
        </div>
      )}
    </div>
  );
}
