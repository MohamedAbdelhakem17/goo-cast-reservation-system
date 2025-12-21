import { useUpdateBooking } from "@/apis/admin/manage-booking.api";
import { useCreateBooking } from "@/apis/public/booking.api";
import { useAuth } from "@/context/Auth-Context/AuthContext";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import {
  getBookingInitialValues,
  getBookingValidationSchema,
} from "@/utils/schemas/booking.schema";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function useAdminCreateBooking({ data, isEdit, bookingId = null }) {
  // Localization
  const { t } = useLocalization();

  const { user } = useAuth();

  // Navigation
  const navigate = useNavigate();

  // Mutation
  const { createBooking, isPending: creating } = useCreateBooking(user?.role);
  const { isPending: updating, updateBooking } = useUpdateBooking();

  // Hooks
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Parse local storage data safely
  const parsedData = useMemo(() => {
    try {
      const localStorageData = localStorage.getItem("bookingData");
      return localStorageData ? JSON.parse(localStorageData) : null;
    } catch (err) {
      console.error("Failed to parse booking data:", err);
      return null;
    }
  }, []);

  // Handle booking creation
  const handleCreateBooking = useCallback(
    async (payload, setSubmitting) => {
      try {
        await createBooking(payload, {
          onSuccess: (res) => {
            addToast(res.message || "Booking submitted successfully", "success", 1000);
            queryClient.invalidateQueries("get-bookings");
            setTimeout(() => navigate("/admin-dashboard/booking/"), 1200);
          },
          onError: (err) => {
            addToast(err.response?.data?.message || "Something went wrong", "error");
          },
        });
      } catch (error) {
        addToast("Unexpected error occurred", "error");
      } finally {
        setSubmitting(false);
      }
    },
    [createBooking, addToast, navigate],
  );

  // Handle booking update
  const handleUpdateBooking = useCallback(
    async (payload, setSubmitting) => {
      try {
        await updateBooking(
          { payload, id: bookingId },
          {
            onSuccess: (res) => {
              addToast(res.message || "Booking updated successfully", "success", 1000);
              queryClient.invalidateQueries("get-bookings");
              setTimeout(() => navigate("/admin-dashboard/booking/"), 1200);
            },
            onError: (err) => {
              addToast(err.response?.data?.message || "Something went wrong", "error");
            },
          },
        );
      } catch (error) {
        addToast("Unexpected error occurred", "error");
      } finally {
        setSubmitting(false);
      }
    },
    [updateBooking, addToast, navigate, bookingId],
  );

  // Compute initial values from DB data or local storage
  const initialValues = useMemo(
    () => getBookingInitialValues(data || parsedData),
    [parsedData, data],
  );

  // Formik configuration
  const formik = useFormik({
    initialValues,
    validationSchema: getBookingValidationSchema(t),
    onSubmit: async (values, { setSubmitting }) => {
      const payload = {
        ...values,
        studio: { id: values.studio.id },
        package: { id: values.selectedPackage.id },
        totalPrice: values.totalPrice,
        coupon_code: values.couponCode,
        totalPriceAfterDiscount: values.totalPriceAfterDiscount || values.totalPrice,
        personalInfo: {
          ...values.personalInfo,
          fullName: `${values.personalInfo.firstName} ${values.personalInfo.lastName}`,
        },
      };

      console.log(payload);
      if (isEdit) {
        await handleUpdateBooking(payload, setSubmitting);
      } else {
        await handleCreateBooking(payload, setSubmitting);
      }
    },
    enableReinitialize: true,
  });

  // Helper function to get nested field values safely
  const getFieldValue = (field) => {
    const keys = field?.split(".");
    return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.values);
  };

  // Mark all fields as touched when editing (to trigger validations)
  useEffect(() => {
    if (data) {
      Object.keys(initialValues).forEach((key) => {
        formik.setFieldTouched(key, true, false);
      });
    }
  }, [data]);

  return {
    formik,
    values: formik.values,
    errors: formik.errors,
    setFieldValue: formik.setFieldValue,
    getFieldValue,
    handleSubmit: formik.handleSubmit,
    isPending: creating || updating,
  };
}
