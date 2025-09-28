import ImagesInputs from "./_components/images-inputs";
import { Input, ErrorFeedback } from "@/components/common";

export default function StudioSharedFields({ formik }) {
  return (
    <>
      {/* Base Price Per Slot + Fixed Hourly Checkbox */}
      <div className="my-2 flex flex-col md:flex-row md:gap-6">
        <Input
          type="number"
          label="Base Price Per Slot"
          id="basePricePerSlot"
          name="basePricePerSlot"
          value={formik.values.basePricePerSlot}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errors={formik.errors.basePricePerSlot}
          touched={formik.touched.basePricePerSlot}
          placeholder="Enter base price"
          className="w-3/4"
        />

        <div className="flex w-full items-center space-x-2 md:w-1/4">
          <label className="flex cursor-pointer items-center space-x-2">
            <input
              type="checkbox"
              name="isFixedHourly"
              checked={formik.values.isFixedHourly}
              onChange={() =>
                formik.setFieldValue("isFixedHourly", !formik.values.isFixedHourly)
              }
              className="text-main h-6 w-6 rounded p-3"
            />
            <span className="text-gray-700">Fixed Hourly Rate</span>
          </label>
        </div>
      </div>

      {/* Recording Seats */}
      <Input
        type="number"
        label="Recording Seats"
        id="recording_seats"
        name="recording_seats"
        value={formik.values.recording_seats}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errors={formik.errors.recording_seats}
        touched={formik.touched.recording_seats}
        placeholder="Add recording seats"
        className="my-2 w-full"
      />

      {/* Min Slots Per Day */}
      <div className="my-2 rounded-lg bg-gray-50 p-6">
        <label className="mb-4 block text-sm font-medium text-gray-700">
          Minimum Slots Per Day
        </label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ].map((day) => (
            <div key={day} className="flex flex-col">
              <label className="mb-1 text-sm text-gray-600 capitalize">{day}</label>
              <input
                type="number"
                name={`minSlotsPerDay.${day}`}
                min={0}
                value={formik.values.minSlotsPerDay[day]}
                onChange={formik.handleChange}
                className="rounded-md border border-gray-300 px-3 py-2"
              />
              {formik.touched.minSlotsPerDay?.[day] &&
                formik.errors.minSlotsPerDay?.[day] && (
                  <ErrorFeedback>{formik.errors.minSlotsPerDay[day]}</ErrorFeedback>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Images and Thumbnail */}
      <ImagesInputs form={formik} />
    </>
  );
}
