import { useUpdateBooking } from "@/apis/admin/manage-booking.api";
import { Button, Taps } from "@/components/common";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import AppointmentTab from "./edit-booking-tabs-content/appointment-tab";
import DetailsTab from "./edit-booking-tabs-content/details-tab";

export default function BookingEditModal({ booking, closeModal, activeTab = "details" }) {
  // State
  const [openTab, setOpenTab] = useState(activeTab);

  // Mutation
  const { updateBooking, isPending } = useUpdateBooking();

  // Hooks
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Formik and  validation
  const initialValues = {
    studio: booking.studio?._id || "",
    selectedPackage: booking.package?._id || "",
    selectedAddOns:
      booking.addOns?.map((a) => ({
        id: a.item?._id || a.item?.id || "",
        name: a.item?.name || {},
        price: a.price ?? a.item?.price ?? 0,
        quantity: a.quantity ?? 1,
      })) || [],
    status: booking.status || "new",
    date: booking.date || "",
    startSlot: booking.startSlot || "",
    duration: booking.duration || 1,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      // crete payload data
      const updatedData = {};
      Object.keys(values).forEach((key) => {
        if (JSON.stringify(values[key]) !== JSON.stringify(initialValues[key])) {
          updatedData[key] = values[key];
        }
      });

      // Call API
      updateBooking(
        { id: booking?._id, payload: updatedData },
        {
          onSuccess: (response) => {
            addToast(response.message || "Booking updated successfully", "success");

            queryClient.refetchQueries("get-bookings");

            closeModal();
          },
          onError: (error) => {
            addToast(error.response?.data?.message || "Something went wrong	", "error");
          },
        },
      );
    },
  });

  // Variables
  const TabsOptions = [
    { id: "details", label: "Booking Details" },
    { id: "appointment", label: "Appointment" },
  ];

  const tabContent = {
    details: <DetailsTab {...formik} />,
    appointment: (
      <AppointmentTab
        {...formik}
        studio={booking?.studio?.id}
        duration={booking.duration}
      />
    ),
  };

  // Effect
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="flex max-h-[90vh] min-h-[90vh] w-full flex-col overflow-y-auto rounded-2xl bg-white px-6 py-5 shadow-xl md:max-w-[60%]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-gray-300 pb-3">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-wide">
            <span className="bg-main block h-6 w-1.5 rounded-full"></span>
            Edit Booking
          </h2>
          <button
            onClick={closeModal}
            className="group border-main hover:bg-main text-main relative flex size-7 cursor-pointer items-center justify-center rounded-full border-2 transition-all hover:text-white"
          >
            <X className="size-5 transition-all group-hover:scale-110 group-hover:rotate-90" />
          </button>
        </div>

        {/* Tabs */}
        <Taps tabs={TabsOptions} activeTabId={openTab} onTabChange={setOpenTab} />

        {/* Tab Content */}
        <div className="flex-1">{tabContent[openTab]}</div>

        {/* Submit Button */}
        <Button
          type="button"
          onClick={formik.handleSubmit}
          className="ms-auto w-fit"
          isPending={isPending}
        >
          Save Changes
        </Button>
      </motion.div>
    </motion.div>
  );
}
