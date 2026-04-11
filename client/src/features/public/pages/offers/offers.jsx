import { Loading } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import TimeCalendar from "../../../admin-dashboard/pages/booking-management/add-booking/time";
import { OfferHeader, OfferSelectSlots } from "./_components";
import OfferAddOns from "./_components/offer-addons";
import OfferBundlesSection from "./_components/offer-bundles-section";
import OfferCart from "./_components/offer-cart";
import OffersPersonalInformation from "./_components/offers-personal-information";
import SelectStudio from "./_components/select-studio";
import StudioImages from "./_components/studio-images";
import useOffersPageLogic from "./_hooks/use-offers-page-logic";

export default function Offers() {
  const { t, lng } = useLocalization();
  const {
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
    handleBookNow,
    handleDateSelect,
    getFieldError,
    handleScrollToBooking,
    handleSubmitBooking,
  } = useOffersPageLogic({ lng });

  // Loading Case
  if (isLoading) {
    return <Loading />;
  }

  // Error Case
  if (error) {
    return (
      <div className="my-20 text-center">
        {t("error-loading-offer-details", "Error loading offer details.")}
      </div>
    );
  }

  if (!bundles?.length) {
    return (
      <div className="my-20 text-center">
        {t("no-active-bundles-available", "No active bundles available right now.")}
      </div>
    );
  }

  // const actualPrice = bundle?.bundle_actual_price * bundle?.category?.minHours;
  // const price = bundle?.price * bundle?.category?.minHours;
  // const discountAmount = actualPrice - price;

  return (
    <div className="relative container mx-auto mt-6 min-h-screen space-y-8 bg-white p-3 pt-10 transition-colors duration-300 dark:bg-gray-950">
      {/* Offer Header */}
      <OfferHeader
        badge={t("studio-bundles", "Studio Bundles")}
        title={t(
          "premium-studio-packages-built-for-creators",
          "Premium Studio Packages Built for Creators",
        )}
        description={t(
          "studio-bundles-hero-description",
          "Professional studio time, expert equipment, and content creation services all bundled to save you time and money.",
        )}
        primaryActionLabel={t("view-bundles", "View Bundles")}
        secondaryActionLabel={t("book-now", "Book Now")}
        onPrimaryAction={handleScrollToBooking}
        onSecondaryAction={handleScrollToBooking}
      />

      {/* Images */}
      <StudioImages />

      <div ref={selectBundlesRef}>
        <OfferBundlesSection
          bundles={bundles}
          selectedBundleId={selectedBundleId}
          onSelectBundle={setSelectedBundleId}
          lng={lng}
          t={t}
        />
      </div>

      {/* Select Time */}

      <div className="space-y-6">
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
        onClick={handleSubmitBooking}
        className="bg-main ms-auto flex w-full items-center justify-center gap-x-3 rounded-md px-4 py-2 text-lg text-white disabled:bg-gray-100 disabled:text-gray-400"
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
