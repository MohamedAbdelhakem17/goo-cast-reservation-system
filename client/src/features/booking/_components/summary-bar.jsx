import { useBooking } from "@/context/Booking-Context/BookingContext";
import useLocalization from "@/context/localization-provider/localization-context";
import useDataFormat from "@/hooks/useDateFormat";
import useTimeConvert from "@/hooks/useTimeConvert";
import { ChevronsRight } from "lucide-react";
import { useMemo } from "react";

export default function SummaryBar() {
  // Localization
  const { lng } = useLocalization();

  // Hooks
  const { setCurrentStep, currentStep, bookingData } = useBooking();
  const timeFormat = useTimeConvert();
  const dateFormat = useDataFormat();

  const steps = useMemo(
    () => [
      {
        id: 1,
        label: "Studio",
        value: bookingData?.studio?.name?.[lng],
      },
      {
        id: 2,
        label: "Date",
        value:
          bookingData?.date && bookingData?.startSlot
            ? `${dateFormat(bookingData.date)} • ${timeFormat(bookingData.startSlot)}`
            : null,
      },
      {
        id: 3,
        label: "Package",
        value: bookingData?.selectedPackage?.name?.[lng],
      },
    ],
    [bookingData, lng, dateFormat, timeFormat],
  );

  // Variable
  const hiddenSteps = [5];
  const visibleSteps = steps.filter((step) => step.value);

  // Empty case
  if (!bookingData?.studio?.id || hiddenSteps.includes(currentStep)) {
    return null;
  }

  return (
    <>
      {/* Separator */}
      <div className="pb-12 lg:hidden" />

      {/* Summary bar parent*/}
      <div className="fixed right-0 bottom-[65px] left-0 z-40 md:hidden">
        {/* Container */}
        <div className="border-main mx-auto flex items-center gap-2 overflow-x-auto border-t bg-white/90 px-4 py-4 text-sm backdrop-blur-lg">
          {/* Display ite,s */}
          {visibleSteps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isClickable = step.id < currentStep && !isActive;

            return (
              <div key={step.id} className="flex shrink-0 items-center gap-2">
                {/* Breadcrumb action */}
                <button
                  type="button"
                  aria-current={isActive ? "step" : undefined}
                  aria-disabled={!isClickable}
                  disabled={!isClickable}
                  onClick={() => isClickable && setCurrentStep(step.id)}
                  className={`max-w-[200px] truncate rounded-full px-3 py-1 transition-all ${
                    isActive
                      ? "bg-main font-semibold text-white"
                      : "bg-gray-100 text-gray-600"
                  } ${
                    isClickable
                      ? "cursor-pointer hover:bg-black hover:text-white"
                      : "cursor-default"
                  }`}
                >
                  {step.value}
                </button>

                {/* Next Arrow flag */}
                {index < visibleSteps.length - 1 && (
                  <ChevronsRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
