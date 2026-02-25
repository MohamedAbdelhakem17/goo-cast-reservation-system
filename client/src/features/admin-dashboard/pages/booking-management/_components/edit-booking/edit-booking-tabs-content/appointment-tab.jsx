import { useGetAvailableSlots, useGetFullyBookedDates } from "@/apis/public/booking.api";
import { SelectInput } from "@/components/common";
import useTimeConvert from "@/hooks/useTimeConvert";

/* helpers */
const normalizeDate = (date) => {
  if (!date) return "";
  // لو جاي ISO من السيرفر
  if (date.includes("T")) return date.split("T")[0];
  return date;
};

export default function AppointmentTab({ duration, studio, values, setFieldValue }) {
  const timeFormat = useTimeConvert();

  const { data: fullyBookedDates } = useGetFullyBookedDates(duration);
  const { getSlots, data: slots } = useGetAvailableSlots();

  /* أقل تاريخ = النهارده */
  const today = new Date().toISOString().split("T")[0];

  const isDateDisabled = (date) => {
    if (!date || !fullyBookedDates?.data) return false;
    return fullyBookedDates.data.includes(date);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;

    // حدّث التاريخ دايمًا
    setFieldValue("date", newDate);
    setFieldValue("startSlot", "");

    // لو اليوم Fully booked ما تجيبش slots
    if (isDateDisabled(newDate)) return;

    getSlots({
      studioId: studio,
      date: newDate,
      duration: duration || 1,
    });
  };

  const disabledDate = isDateDisabled(values.date);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* DATE INPUT */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-semibold text-gray-700">Date</label>

          <div
            className={`group relative flex w-full items-center gap-3 rounded-xl border px-4 py-3 shadow-sm transition-all ${
              disabledDate
                ? "border-red-400 bg-red-50 text-red-700"
                : "border-gray-200 bg-white focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100 hover:border-rose-400"
            }`}
          >
            <input
              type="date"
              min={today}
              value={normalizeDate(values.date)}
              onChange={handleDateChange}
              className="flex-1 cursor-pointer bg-transparent text-gray-900 outline-none"
            />
          </div>

          {disabledDate && (
            <p className="text-xs font-medium text-red-500">This date is fully booked</p>
          )}
        </div>

        {/* SLOT SELECT */}
        <div className="flex flex-col space-y-1">
          <SelectInput
            label="Available Slots"
            disabled={!values.date || disabledDate}
            value={values.startSlot || ""}
            className="!mb-0 w-full [&>div]:rounded-xl [&>div]:px-4 [&>div]:py-3"
            onChange={(e) => setFieldValue("startSlot", e.target.value)}
            name="slot"
            options={
              slots?.data?.length
                ? slots.data.map((s) => ({
                    label: timeFormat(s.startTime),
                    value: s.startTime,
                  }))
                : [{ label: "No slots available", value: "" }]
            }
            placeholder={
              !values.date
                ? "Select a date first"
                : disabledDate
                  ? "Date is fully booked"
                  : "Choose a slot"
            }
          />
        </div>
      </div>
    </div>
  );
}
