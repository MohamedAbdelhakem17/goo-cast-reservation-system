import { useGetSingleBundle } from "@/apis/admin/manage-package.api";
import { useGetAvailableSlots, useGetAvailableStudios } from "@/apis/public/booking.api";
import { Loading } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TimeCalendar from "../../../admin-dashboard/pages/booking-management/add-booking/time";
import { OfferHeader, OfferSelectSlots } from "./_components";
import OfferAddOns from "./_components/offer-addons";
import OfferCart from "./_components/offer-cart";
import OfferInformation from "./_components/offer-information";
import OfferSectionTitle from "./_components/offer-section-title";
import OffersPersonalInformation from "./_components/offers-personal-information";
import SelectStudio from "./_components/select-studio";
import useOfferBooking from "./_hooks/use-offer-booking";

export default function Offers() {
  // Translation
  const { t, lng } = useLocalization();

  // Navigation
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const { slug } = useParams();

  // Sate
  const { data: { data: bundle = {} } = {}, isLoading, error } = useGetSingleBundle(slug);
  const selectTimeRef = useRef(null);

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

  // Mutations
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

  // Functions
  const handleBookNow = () => {
    try {
      localStorage.setItem("bookingData", JSON.stringify(values));
    } catch (err) {
      console.error("Failed to persist booking data:", err);
    }

    navigate("/booking");
  };

  const handleDateSelect = (payload) => {
    getSlots(payload);
  };

  const getFieldError = (field) => {
    const keys = field?.split(".");
    return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.errors);
  };

  const handleScrollToBooking = () => {
    const element = selectTimeRef.current;
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - 115;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
  };

  // Variables
  const isOfferPage = path.includes("/offers/");

  // Effects
  useEffect(() => {
    // Clear Local Storage
    return () => {
      if (isOfferPage) {
        localStorage.removeItem("bookingData");
      }
    };
  }, [isOfferPage]);

  // Loading Case
  if (isLoading) {
    return <Loading />;
  }

  // Error Case
  if (error) {
    return <div className="my-20 text-center">Error loading offer details.</div>;
  }

  return (
    <div className="relative container mx-auto mt-6 min-h-screen space-y-8 bg-white p-3 pt-10 transition-colors duration-300 dark:bg-gray-950">
      {/* Offer Header */}
      <OfferHeader
        badge={t("limited-time-offer")}
        title={bundle?.name?.[lng]}
        description={bundle?.description?.[lng]}
        onBookNow={handleBookNow}
      />

      {/* Book now btn */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleScrollToBooking}
          className="bg-main hover:bg-main/90 rounded-lg px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          {t("book-now", "Book Now")}
        </button>
      </div>

      {/* Offer Information */}
      <OfferInformation
        information={[...bundle?.post_session_benefits[lng], ...bundle?.details[lng]]}
      />

      {/* Select Time */}

      <div className="space-y-6" ref={selectTimeRef}>
        <OfferSectionTitle
          title={t("select-time-and-date", "Select Your session Date and Time")}
          info={t(
            "select-time-and-date-info",
            "Choose the perfect date and time for your session",
          )}
        />

        <TimeCalendar
          duration={values?.duration || bundle?.category?.minHours || 4}
          onDateSelect={handleDateSelect}
          bookingData={values}
          setFieldValue={setFieldValue}
          isBlocked={false}
        />

        {/* Date Validation Error */}
        {formik?.touched?.date && formik?.errors?.date && (
          <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">{formik.errors.date}</p>
          </div>
        )}
      </div>

      {/* Select Slots  */}
      <OfferSelectSlots
        slots={slots}
        isPending={isSlotsPending}
        error={slotsError}
        setFieldValue={setFieldValue}
        values={values}
        formik={formik}
      />

      {/* Select Studio */}
      <SelectStudio
        availableStudiosData={availableStudiosData}
        isLoadingAvailable={isLoadingAvailable}
        errorAvailable={errorAvailable}
        values={values}
        setFieldValue={setFieldValue}
        t={t}
        lng={lng}
        formik={formik}
      />

      {/* Select Addons */}
      <div className="space-y-4">
        <OfferAddOns bookingData={values} setBookingField={setFieldValue} />
      </div>

      {/* Personal information */}
      <OffersPersonalInformation
        t={t}
        values={values}
        setFieldValue={setFieldValue}
        formik={formik}
        getFieldError={getFieldError}
      />

      {/* Cart */}
      <div className="w-full">
        <OfferCart
          data={values}
          setFieldValue={setFieldValue}
          getFieldValue={getFieldValue}
          actualPrice={bundle?.bundle_actual_price}
        />
      </div>

      <button
        type="button"
        disabled={isBookingPending || !formik.isValid}
        className="bg-main ms-auto flex w-full items-center justify-center gap-x-3 rounded-md px-4 py-2 text-lg text-white disabled:bg-gray-100 disabled:text-gray-400"
        onClick={handleSubmit}
      >
        {isBookingPending ? t("processing", "Processing...") : t("book-now", "Book Now")}
      </button>

      {/* Validation Errors */}
      {formik.touched && !formik.isValid && Object.keys(formik.errors).length > 0 && (
        <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <h4 className="font-semibold text-red-800 dark:text-red-400">
            {t("please-fix-the-following-errors", "Please fix the following errors:")}
          </h4>
          <ul className="list-inside list-disc space-y-1 text-sm text-red-700 dark:text-red-300">
            {formik.errors.startSlot && <li>{formik.errors.startSlot}</li>}
            {formik.errors.personalInfo?.firstName && (
              <li>{formik.errors.personalInfo.firstName}</li>
            )}
            {formik.errors.personalInfo?.email && (
              <li>{formik.errors.personalInfo.email}</li>
            )}
            {formik.errors.personalInfo?.phone && (
              <li>{formik.errors.personalInfo.phone}</li>
            )}
            {formik.errors?.studio && <li>{formik.errors.studio}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
