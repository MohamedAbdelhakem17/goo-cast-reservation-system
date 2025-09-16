/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useFormik } from "formik";
import { Input, TextArea } from "@/components/common";
import { motion } from "framer-motion";
import AddNewStudio from "@/apis/studios/add.studio.api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GetStudioByID, UpdateStudio } from "@/apis/studios/studios.api";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { ErrorFeedback } from "@/components/common";
import { initialValues, validationSchema } from "@/utils/schemas/studio.schema";
import ImagesInputs from "./_components/images-inputs";
import EquipmentInput from "./_components/equipment-input";
import FacilitiesInput from "./_components/facilities-input";

export default function AddStudio() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { formik, isPending } = AddNewStudio({
    onSuccess: (response) => {
      addToast(response.message || "Studio added successfully", "success");
      setTimeout(() => {
        navigate("/admin-dashboard/studio");
      }, 2000);
    },
    onError: (error) => {
      addToast(error.response?.data?.message || "Something went wrong", "error");
    },
  });
  const [searchParams] = useSearchParams();
  const { data: updatedStudio } = GetStudioByID(searchParams.get("edit"));
  const { mutate: updateStudio, isLoading: isUpdating } = UpdateStudio();
  const isEdit = Boolean(searchParams.get("edit"));

  // Formik setup
  const form = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const finalData = {
        ...values,
      };

      if (isEdit) {
        updateStudio(
          { id: updatedStudio.data._id, data: finalData },
          {
            onSuccess: (response) => {
              addToast(response.message || "Studio updated successfully", "success");
              setTimeout(() => {
                navigate("/admin-dashboard/studio-management");
              }, 2000);
            },
            onError: (error) => {
              addToast(error.response?.data?.message || "Something went wrong", "error");
            },
          },
        );
      } else {
        formik.setValues(finalData);
        setTimeout(() => {
          formik.handleSubmit();
        }, 100);
      }
    },
  });

  useEffect(() => {
    if (isEdit && updatedStudio?.data) {
      const d = updatedStudio.data;
      form.setValues({
        name: d.name || "",
        address: d.address || "",
        basePricePerSlot: d.basePricePerSlot || 0,
        isFixedHourly: d.isFixedHourly || false,
        description: d.description || "",
        startTime: d.startTime || "00:00",
        endTime: d.endTime || "00:00",
        facilities: d.facilities || [],
        equipment: d.equipment || [],
        thumbnail: d.thumbnail || null,
        imagesGallery: d.imagesGallery || [],
        minSlotsPerDay: d.minSlotsPerDay || {
          sunday: 1,
          monday: 1,
          tuesday: 1,
          wednesday: 1,
          thursday: 1,
          friday: 1,
          saturday: 1,
        },
        dayOff: d.dayOff || [],
        currentFacility: "",
        currentEquipment: "",
      });
    }
  }, [isEdit, updatedStudio]);

  const currentLoading = isEdit ? isUpdating : isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ms:p-8 container mx-auto py-6"
    >
      <div className="md:p-8">
        <h2 className="border-main mb-8 rounded-md border-b pb-4 text-center text-3xl font-bold text-gray-800">
          {isEdit ? "Edit Studio" : "Add New Studio"}
        </h2>

        <form
          onSubmit={form.handleSubmit}
          className="space-y-8 rounded-md bg-white px-4 py-8 shadow"
        >
          {/* Studio Basic Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Studio Name"
              id="name"
              name="name"
              value={form.values.name}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              errors={form.touched.name && form.errors.name}
              placeholder="Enter studio name"
            />

            <Input
              label="Address"
              id="address"
              name="address"
              value={form.values.address}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              errors={form.touched.address && form.errors.address}
              placeholder="Enter studio address"
            />
          </div>

          {/* Price + Fixed Hourly */}
          <div className="flex flex-col md:flex-row md:gap-6">
            <Input
              type="number"
              label="Base Price Per Slot"
              id="basePricePerSlot"
              name="basePricePerSlot"
              value={form.values.basePricePerSlot}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              errors={form.touched.basePricePerSlot && form.errors.basePricePerSlot}
              placeholder="Enter base price"
              className="w-3/4"
            />

            <div className="flex w-full items-center space-x-2 md:w-1/4">
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  name="isFixedHourly"
                  checked={form.values.isFixedHourly}
                  onChange={() =>
                    form.setFieldValue("isFixedHourly", !form.values.isFixedHourly)
                  }
                  className="text-main h-6 w-6 rounded p-3"
                />
                <span className="text-gray-700">Fixed Hourly Rate</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <TextArea
            label="Description"
            value={form.values.description}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            id="description"
            name="description"
            errors={form.touched.description && form.errors.description}
            placeholder="Enter studio Description"
            rows={4}
          />

          {/* Facilities */}
          <FacilitiesInput form={form} />

          {/* Equipment */}
          <EquipmentInput form={form} />

          {/* Studio Hours + Day Off */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Hours */}
            <div className="rounded-lg bg-gray-50 p-6">
              <label className="mb-4 block text-sm font-medium text-gray-700">
                Studio Hours
              </label>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-gray-600">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={form.values.startTime}
                    onChange={form.handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-gray-600">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={form.values.endTime}
                    onChange={form.handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>
            {/* Day Off */}
            <div className="rounded-lg bg-gray-50 p-6">
              <label className="mb-4 block text-sm font-medium text-gray-700">
                Days Off
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  "sunday",
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                ].map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="dayOff"
                      checked={form.values.dayOff.includes(day)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...form.values.dayOff, day]
                          : form.values.dayOff.filter((d) => d !== day);
                        form.setFieldValue("dayOff", updated);
                      }}
                      className="h-4 w-4"
                    />
                    <span className="capitalize">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Min Slots Per Day */}
          <div className="rounded-lg bg-gray-50 p-6">
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
                    value={form.values.minSlotsPerDay[day]}
                    onChange={form.handleChange}
                    className="rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Images and Thumbnail */}
          <ImagesInputs form={form} />

          {Object.keys(form.errors).length > 0 && form.submitCount > 0 && (
            <div className="rounded-lg border border-red-200 p-4">
              <h3 className="mb-2 font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <ul className="space-y-1">
                {Object.entries(form.errors).map(([field, error]) => (
                  <li key={field}>
                    <ErrorFeedback>{error}</ErrorFeedback>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={currentLoading}
            className={`bg-main w-full rounded-lg px-8 py-3 text-white transition ${
              currentLoading ? "cursor-not-allowed opacity-50" : "hover:bg-main/90"
            }`}
            whileHover={{ scale: !currentLoading ? 1.02 : 1 }}
            whileTap={{ scale: !currentLoading ? 0.98 : 1 }}
          >
            {currentLoading
              ? isEdit
                ? "Updating..."
                : "Adding..."
              : isEdit
                ? "Update Studio"
                : "Add Studio"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
