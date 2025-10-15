import { Loading, EmptyState } from "@/components/common";
import { SlotButton } from "@/components/booking";
import { calculateEndTime, calculateTotalPrice } from "@/hooks/useManageSlots";
import { Clock, TimerOff } from "lucide-react";

export default function AdminSelectSlots({
  setFieldValue,
  values,
  isPending,
  slots,
  error,
  isEdit,
  currentSlot,
}) {
  const handelCalculatePrice = (time) => {
    const endTime = calculateEndTime(time, +values.duration);
    const totalPrice = calculateTotalPrice(
      +values.duration,
      +values?.selectedPackage?.price,
    );

    setFieldValue("startSlot", time);
    setFieldValue("endSlot", endTime);
    setFieldValue("totalPackagePrice", totalPrice);
  };

  //  Loading state
  if (isPending) return <Loading />;

  //  Error state
  if (error) {
    return <EmptyState message="Failed to load available slots" Icon={TimerOff} />;
  }

  //  Empty state
  if (!slots) return null;

  if (slots?.data.length === 0 && !values.startSlot) {
    return <EmptyState message="No available time slots for this date" Icon={TimerOff} />;
  }

  return (
    <>
      {/* Header */}
      <h3 className="flex items-center text-2xl font-bold">
        <Clock className="text-main me-2" />
        Select available slot
      </h3>

      {/* Edit Mode Slot */}
      {isEdit && currentSlot && (
        <div className="mb-3">
          <SlotButton time={currentSlot} isSelected index={-1} />
          {slots?.data.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">No available times in this day</p>
          )}
        </div>
      )}

      {/* Slots Grid */}
      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
        {slots?.data.map((slot, index) => (
          <SlotButton
            key={index}
            time={slot.startTime}
            isSelected={values?.startSlot === slot.startTime}
            onClick={() => handelCalculatePrice(slot.startTime)}
            index={index}
          />
        ))}
      </div>
    </>
  );
}
