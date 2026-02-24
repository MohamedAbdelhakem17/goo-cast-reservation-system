import { useCreateBooking } from "@/apis/public/booking.api";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import {
  getBookingInitialValues,
  getBookingValidationSchema,
} from "@/utils/schemas/booking.schema";
import { useFormik } from "formik";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const buildOfferDefaults = (baseValues, bundle) => {
  const bundleId = bundle?._id || bundle?.id || null;
  if (!bundleId) return baseValues;

  const duration = bundle?.category?.minHours || baseValues.duration || 1;
  const packagePrice = Number(bundle?.price ?? 0);
  const totalPackagePrice = packagePrice * duration;

  return {
    ...baseValues,
    duration,
    selectedPackage: {
      id: bundleId,
      name: bundle?.name || {},
      price: packagePrice,
      slug: bundle?.slug || "",
      category: bundle?.category || null,
    },
    totalPackagePrice,
    totalPrice: totalPackagePrice,
    totalPriceAfterDiscount: totalPackagePrice,
  };
};

export default function useOfferBooking({ bundle, data = null }) {
  // Localization
  const { t } = useLocalization();

  // Navigation
  const navigate = useNavigate();

  // Hooks
  const { addToast } = useToast();

  // Mutation
  const { createBooking, isPending } = useCreateBooking();

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

  // Compute initial values from bundle or local storage
  const initialValues = useMemo(() => {
    const baseValues = getBookingInitialValues(data || parsedData);
    return buildOfferDefaults(baseValues, bundle);
  }, [data, parsedData, bundle]);

  // Handle booking creation
  const handleCreateBooking = useCallback(
    (values, { setSubmitting, resetForm }) => {
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
        extraComments: values.extraComment,
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
    },
    [createBooking, addToast, navigate],
  );

  // Formik configuration
  const formik = useFormik({
    initialValues,
    validationSchema: getBookingValidationSchema(t).omit(["totalPriceAfterDiscount"]),
    onSubmit: (values, helpers) => handleCreateBooking(values, helpers),
    enableReinitialize: true,
  });

  // Helper function to get nested field values safely
  const getFieldValue = (field) => {
    const keys = field?.split(".");
    return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.values);
  };

  return {
    formik,
    values: formik.values,
    errors: formik.errors,
    setFieldValue: formik.setFieldValue,
    getFieldValue,
    handleSubmit: formik.handleSubmit,
    isPending,
  };
}
