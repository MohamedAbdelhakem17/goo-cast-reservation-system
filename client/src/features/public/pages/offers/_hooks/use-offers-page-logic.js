import { useGetAllActiveBundles } from "@/apis/admin/manage-package.api";
import { useGetAvailableSlots, useGetAvailableStudios } from "@/apis/public/booking.api";
import { tracking } from "@/utils/gtm";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useOfferBooking from "./use-offer-booking";

const getBundleId = (item) => item?._id || item?.id;

export default function useOffersPageLogic({ lng }) {
  const path = useLocation().pathname;

  const {
    data: { data: bundles = [] } = {},
    isLoading,
    error,
  } = useGetAllActiveBundles();

  const [selectedBundleId, setSelectedBundleId] = useState(null);

  const bundle = useMemo(() => {
    return bundles.find((item) => getBundleId(item) === selectedBundleId) || {};
  }, [bundles, selectedBundleId]);

  const selectBundlesRef = useRef(null);

  const {
    values,
    setFieldValue,
    getFieldValue,
    formik,
    handleSubmit,
    isPending: isBookingPending,
  } = useOfferBooking({
    bundle,
  });

  const {
    getSlots,
    data: slots,
    isPending: isSlotsPending,
    error: slotsError,
  } = useGetAvailableSlots();

  const {
    data: availableStudiosData,
    isLoading: isLoadingAvailable,
    error: errorAvailable,
  } = useGetAvailableStudios({
    date: values.date,
    startSlot: values.startSlot,
    duration: values.duration,
  });



  const handleDateSelect = useCallback(
    (payload) => {
      getSlots(payload);
    },
    [getSlots],
  );

  const getFieldError = useCallback(
    (field) => {
      const keys = field?.split(".");
      return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.errors);
    },
    [formik.errors],
  );

  const handleScrollToBooking = useCallback(() => {
    const element = selectBundlesRef.current;
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top + window.scrollY - 115;
    window.scrollTo({ top: elementPosition, behavior: "smooth" });
  }, []);

  const handleSubmitBooking = useCallback(() => {
    if (formik.isSubmitting) return;

    handleSubmit();
    tracking("create_booking", {
      totalPrice: values.totalPrice,
    });
  }, [formik.isSubmitting, handleSubmit, values.totalPrice]);

  const isOfferPage = path.includes("/offers/");

  useEffect(() => {
    return () => {
      if (isOfferPage) {
        localStorage.removeItem("bookingData");
      }
    };
  }, [isOfferPage]);

  useEffect(() => {
    if (!bundle?.name) return;

    tracking("add-package", {
      package_name: bundle?.name?.[lng],
      price: bundle?.price,
    });
  }, [bundle, lng]);

  return {
    bundles,
    bundle,
    isLoading,
    error,
    selectedBundleId,
    setSelectedBundleId,
    selectBundlesRef,
    values,
    setFieldValue,
    getFieldValue,
    formik,
    isBookingPending,
    slots,
    isSlotsPending,
    slotsError,
    availableStudiosData,
    isLoadingAvailable,
    errorAvailable,
    handleDateSelect,
    getFieldError,
    handleScrollToBooking,
    handleSubmitBooking,
  };
}
