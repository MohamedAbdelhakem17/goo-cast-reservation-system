import { useFormik } from "formik";
import { useMemo, useCallback } from "react";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useNavigate } from "react-router-dom";
import { useCreateBooking } from "@/apis/public/booking.api";
import useLocalization from "@/context/localization-provider/localization-context";
import {
  getBookingInitialValues,
  getBookingValidationSchema,
} from "@/utils/schemas/booking.schema";

export default function useBookingFormik() {
  // Localization
  const { t } = useLocalization();

  // Navigation
  const navigate = useNavigate();

  // Hooks
  const { addToast } = useToast();

  //  Mutation
  const { createBooking } = useCreateBooking();

  // Variables
  const parsedData = useMemo(() => {
    const localStorageData = localStorage.getItem("bookingData");
    return localStorageData ? JSON.parse(localStorageData) : null;
  }, []);

  // Functions
  const handleCreateBooking = (values, { setSubmitting, resetForm }) => {
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

    createBooking(payload, {
      onSuccess: (res) => {
        localStorage.setItem(
          "bookingConfirmation",
          JSON.stringify({ bookingResponse: res.booking }),
        );

        addToast(res.message || "Booking submitted successfully", "success");
        resetForm();

        setTimeout(() => {
          localStorage.removeItem("bookingData");
          navigate("/booking/confirmation");
        }, 1200);
      },
      onError: (err) => {
        addToast(err.response?.data?.message || "Something went wrong", "error");
      },
      onSettled: () => setSubmitting(false),
    });
  };

  const initialValues = useMemo(() => getBookingInitialValues(parsedData), [parsedData]);

  // Form  and  validation
  const formik = useFormik({
    initialValues,
    validationSchema: getBookingValidationSchema(t),

    onSubmit: (values, { setSubmitting, resetForm }) => {
      handleCreateBooking(values, { setSubmitting, resetForm });
    },

    enableReinitialize: true,
  });

  // Helpers Functions to access formik values and errors
  const setBookingField = useCallback(
    (field, value) => {
      formik.setFieldValue(field, value);
    },
    [formik],
  );

  const getBookingField = (field) => {
    const keys = field?.split(".");
    return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.values);
  };

  const getBookingError = (field) => {
    const keys = field?.split(".");
    return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.errors);
  };

  return {
    formik,
    values: formik.values,
    setBookingField,
    getBookingField,
    getBookingError,
  };
}
