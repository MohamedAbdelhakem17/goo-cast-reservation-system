import { SlotButton, Loading } from "@/components/common";
import { calculateEndTime, calculateTotalPrice } from "@/hooks/useManageSlots";
import { Clock } from "lucide-react";

export default function AdminSelectSlots({ setFieldValue, values, isPending, slots }) {
  // Functions
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

  // Loading state
  if (isPending) {
    return <Loading />;
  }

  // Empty state
  if (!slots) {
    return null;
  }

  return (
    <>
      {/* Title */}
      <h3 className="flex items-center text-2xl font-bold">
        <Clock className="text-main me-2" />
        Select available slot
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
        {slots?.data.map((slot, index) => {
          const isSelected = values?.startSlot === slot.startTime;

          return (
            <SlotButton
              key={index}
              time={slot.startTime}
              isSelected={isSelected}
              onClick={() => handelCalculatePrice(slot.startTime)}
              index={index}
            />
          );
        })}
      </div>
    </>
  );
}
