import { useMemo, useCallback } from "react";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useNavigate } from "react-router-dom";
import { useCreateBooking } from "@/apis/public/booking.api";
import useLocalization from "@/context/localization-provider/localization-context";
import {
  getBookingInitialValues,
  getBookingValidationSchema,
} from "@/utils/schemas/booking.schema";
import { useFormik } from "formik";

export default function useAdminCreateBooking() {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createBooking } = useCreateBooking();

  const parsedData = useMemo(() => {
    try {
      const localStorageData = localStorage.getItem("bookingData");
      return localStorageData ? JSON.parse(localStorageData) : null;
    } catch (err) {
      console.error("Failed to parse booking data:", err);
      return null;
    }
  }, []);

  const handleCreateBooking = useCallback(
    async (values, { setSubmitting }) => {
      try {
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

        await createBooking(payload, {
          onSuccess: (res) => {
            addToast(res.message || "Booking submitted successfully", "success", 500);
            setTimeout(() => navigate("/admin-dashboard/booking/"), 900);
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

  const initialValues = useMemo(() => getBookingInitialValues(parsedData), [parsedData]);

  const formik = useFormik({
    initialValues,
    validationSchema: getBookingValidationSchema(t),
    onSubmit: handleCreateBooking,
    enableReinitialize: true,
  });

  return {
    formik,
    values: formik.values,
    errors: formik.errors,
    setFieldValue: formik.setFieldValue,
    handleSubmit: formik.handleSubmit,
  };
}
