import { useGetSingleBundle } from "@/apis/admin/manage-package.api";
import { useGetAvailableSlots, useGetAvailableStudios } from "@/apis/public/booking.api";
import { BookingInput, BookingPhoneInput } from "@/components/booking";
import { OptimizedImage } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useNavigate, useParams } from "react-router-dom";
import AdminSelectSlots from "../../../admin-dashboard/pages/booking-management/add-booking/_components/admin-select-slots";
import TimeCalendar from "../../../admin-dashboard/pages/booking-management/add-booking/time";
import PaymentOptions from "../../../booking/_components/steps/personal-information/_components/payment-way";
import { OfferHeader } from "./_components";
import OfferAddOns from "./_components/offer-addons";
import OfferCart from "./_components/offer-cart";
import OfferInformation from "./_components/offer-information";
import useOfferBooking from "./_hooks/use-offer-booking";

export default function Offers() {
  // Translation
  const { t, lng } = useLocalization();

  // Navigation
  const navigate = useNavigate();
  const { slug } = useParams();

  const { data: { data: bundle = {} } = {}, isLoading, error } = useGetSingleBundle(slug);

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

  // Fetch available slots
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

  const handleDateSelect = (payload) => {
    getSlots(payload);
  };

  const getFieldError = (field) => {
    const keys = field?.split(".");
    return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.errors);
  };

  // Functions
  const handleBookNow = () => {
    try {
      localStorage.setItem("bookingData", JSON.stringify(values));
    } catch (err) {
      console.error("Failed to persist booking data:", err);
    }

    navigate("/booking");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading offer details.</div>;
  }

  return (
    <div className="relative container mx-auto mt-6 min-h-screen space-y-6 bg-white p-3 pt-10 transition-colors duration-300 dark:bg-gray-950">
      {/* Offer Header */}
      <OfferHeader
        badge={t("limited-time-offer")}
        title={bundle?.name?.[lng]}
        description={bundle?.description?.[lng]}
        onBookNow={handleBookNow}
      />

      {/* Offer Information */}
      <OfferInformation
        information={[...bundle?.post_session_benefits[lng], ...bundle?.details[lng]]}
      />

      {/* Select Time */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {t("select-time-and-date", "Select Your session Date and Time")}
        </h2>
        <TimeCalendar
          duration={values?.duration || bundle?.category?.minHours || 4}
          onDateSelect={handleDateSelect}
          bookingData={values}
          setFieldValue={setFieldValue}
          isBlocked={false}
        />
      </div>

      {/* Select Slots  */}
      <div className="space-y-4">
        <AdminSelectSlots
          slots={slots}
          isPending={isSlotsPending}
          error={slotsError}
          setFieldValue={setFieldValue}
          values={values}
        />
      </div>

      {/* Select Studio */}
      {availableStudiosData?.data?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {t("select-studio", "Select Studio")}
          </h2>

          {isLoadingAvailable && (
            <div className="text-sm text-gray-500">{t("loading", "Loading...")}</div>
          )}

          {errorAvailable && (
            <div className="text-sm text-red-600">
              {t("failed-to-load-studios", "Failed to load studios")}
            </div>
          )}

          {!isLoadingAvailable &&
            !errorAvailable &&
            availableStudiosData?.data?.length === 0 && (
              <div className="text-sm text-gray-500">
                {t("no-available-studios", "No available studios for this time")}
              </div>
            )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {availableStudiosData?.data?.map((studio) => {
              const isSelected = values?.studio?.id === studio._id;

              return (
                <button
                  key={studio._id}
                  type="button"
                  onClick={() =>
                    setFieldValue("studio", {
                      id: studio._id,
                      name: studio.name,
                      image: studio.thumbnail,
                      recording_seats: studio.recording_seats,
                    })
                  }
                  className={`group relative overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 ${
                    isSelected ? "border-main scale-[0.98] border-2" : "border-gray-200"
                  }`}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <OptimizedImage
                      src={studio.thumbnail}
                      alt={studio.name?.[lng]}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                    <h3 className="absolute bottom-3 left-4 z-10 text-lg font-semibold text-white drop-shadow-md">
                      {studio.name?.[lng]}
                    </h3>
                  </div>

                  {isSelected && (
                    <span className="border-main text-main absolute end-2 top-3 rounded-lg bg-white px-2 py-1 text-xs font-bold">
                      {t("selected", "Selected")}
                    </span>
                  )}

                  <div
                    className={`bg-main absolute bottom-0 left-0 h-1 rounded-r-full transition-all duration-300 ${
                      isSelected ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* Select Addons */}
      <div className="space-y-4">
        <OfferAddOns bookingData={values} setBookingField={setFieldValue} />
      </div>

      {/* Personal information */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {t("payment-info", "Personal Information")}
        </h2>

        <div className="w-full space-y-4 rounded-md border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <BookingInput
              className="w-full"
              type="text"
              id="firstName"
              label={t("first-name", "First name")}
              placeholder={t("enter-your-first-name", "Enter your first name")}
              errors={getFieldError("personalInfo.firstName")}
              onBlur={formik.handleBlur}
              onChange={(e) => setFieldValue("personalInfo.firstName", e.target.value)}
              touched={formik.touched.personalInfo?.firstName}
              value={values.personalInfo.firstName}
            />

            <BookingInput
              className="w-full"
              type="text"
              id="lastName"
              label={t("last-name", "Last name")}
              placeholder={t("enter-your-last-name", "Enter your last name")}
              errors={getFieldError("personalInfo.lastName")}
              onBlur={formik.handleBlur}
              onChange={(e) => setFieldValue("personalInfo.lastName", e.target.value)}
              touched={formik.touched.personalInfo?.lastName}
              value={values.personalInfo.lastName}
            />
          </div>

          <BookingInput
            type="text"
            id="email"
            label={t("email", "Email")}
            placeholder={t("enter-your-email", "Enter your email")}
            errors={getFieldError("personalInfo.email")}
            onBlur={formik.handleBlur}
            onChange={(e) => setFieldValue("personalInfo.email", e.target.value)}
            touched={formik.touched.personalInfo?.email}
            value={values.personalInfo.email}
          />

          <BookingPhoneInput
            label={t("phone-number", "Phone number")}
            value={values.personalInfo.phone}
            onChange={(value) => setFieldValue("personalInfo.phone", value)}
            onBlur={() => formik.handleBlur({ target: { name: "personalInfo.phone" } })}
            errors={formik.errors.personalInfo?.phone}
            touched={formik.touched.personalInfo?.phone}
          />

          <BookingInput
            type="text"
            id="extraComment"
            label={t("special-requests-or-comments", "Special requests or comments")}
            placeholder={t(
              "any-special-requirements-equipment-needs-or-additional-information",
              "Any special requirements, equipment needs, or additional information",
            )}
            errors={getFieldError("extraComment")}
            onBlur={formik.handleBlur}
            onChange={(e) => setFieldValue("extraComment", e.target.value)}
            touched={formik.touched.extraComment}
            value={values.extraComment}
          />

          <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
            <PaymentOptions setBookingField={setFieldValue} showInfo={false} />
          </div>
        </div>
      </div>

      {/* Cart */}
      <div className="w-full">
        <OfferCart
          data={values}
          setFieldValue={setFieldValue}
          getFieldValue={getFieldValue}
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
    </div>
  );
}
