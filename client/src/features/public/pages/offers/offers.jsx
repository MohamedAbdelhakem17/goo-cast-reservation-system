import { useGetAllActiveBundles } from "@/apis/admin/manage-package.api";
import { useGetAvailableSlots, useGetAvailableStudios } from "@/apis/public/booking.api";
import { Loading } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { tracking } from "@/utils/gtm";
import { Check, Mic, Sparkles, Video } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TimeCalendar from "../../../admin-dashboard/pages/booking-management/add-booking/time";
import { OfferHeader, OfferSelectSlots } from "./_components";
import OfferAddOns from "./_components/offer-addons";
import OfferCart from "./_components/offer-cart";
import OfferSectionTitle from "./_components/offer-section-title";
import OffersPersonalInformation from "./_components/offers-personal-information";
import SelectStudio from "./_components/select-studio";
import StudioImages from "./_components/studio-images";
import useOfferBooking from "./_hooks/use-offer-booking";

export default function Offers() {
  // Translation
  const { t, lng } = useLocalization();

  // Navigation
  const path = useLocation().pathname;
  const navigate = useNavigate();

  // Sate
  const {
    data: { data: bundles = [] } = {},
    isLoading,
    error,
  } = useGetAllActiveBundles();

  const getBundleId = (item) => item?._id || item?.id;
  const headerThemes = [
    "from-blue-500 to-blue-700",
    "from-fuchsia-500 to-purple-600",
    "from-indigo-500 to-violet-700",
  ];
  const bundleIcons = [Video, Sparkles, Mic];

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
    // baseValues,
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
    const element = selectBundlesRef.current;
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

  useEffect(() => {
    if (!bundle?.name) return;
    tracking("add-package", {
      package_name: bundle?.name?.[lng],
      price: bundle?.price,
    });
  }, [bundle]);

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

      {/* Bundles Section */}
      <section className="space-y-8 py-2 md:space-y-10" ref={selectBundlesRef}>
        <OfferSectionTitle
          title={t("our-bundel", "Our Bundel")}
          info={t(
            "our-bundel-info",
            "Discover the exclusive benefits and features included in our Studio Bundell",
          )}
        />

        <div className="mt-6 grid auto-rows-fr grid-cols-1 gap-7 md:grid-cols-2 md:gap-8 xl:grid-cols-3 xl:gap-10">
          {bundles.map((item, index) => {
            const itemId = getBundleId(item);
            const isSelected = itemId === getBundleId(bundle);
            const bundleName =
              item?.name?.[lng] || item?.name?.en || t("bundle", "Bundle");
            const bundleDescription =
              item?.description?.[lng] || item?.description?.en || "";
            const price = Number(item?.price || 0);
            const actualPrice = Number(item?.bundle_actual_price || 0);
            const hasActualPrice = actualPrice > 0;
            const Icon = bundleIcons[index % bundleIcons.length];
            const benefits = [
              ...(item?.post_session_benefits?.[lng] || []),
              ...(item?.details?.[lng] || []),
            ].filter(Boolean);
            // .slice(0, 5);

            return (
              <article
                key={itemId || bundleName}
                className={`flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all dark:bg-slate-900 ${
                  isSelected
                    ? "border-fuchsia-400 ring-4 ring-fuchsia-200/70 dark:border-fuchsia-400 dark:ring-fuchsia-900/40"
                    : "border-slate-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800"
                }`}
              >
                <div
                  className={`relative flex h-56 flex-col items-center justify-center bg-gradient-to-br px-6 py-8 text-white md:h-60 md:px-7 md:py-9 ${headerThemes[index % headerThemes.length]}`}
                >
                  <div className="mb-5 rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-center text-3xl font-extrabold">{bundleName}</h3>
                  <p className="mt-2 line-clamp-2 text-center text-sm text-white/90">
                    {bundleDescription || t("most-popular", "Most Popular")}
                  </p>
                </div>

                <div className="flex flex-1 flex-col p-7 md:p-8">
                  {hasActualPrice && (
                    <p className="text-center text-base font-semibold text-slate-400 line-through dark:text-slate-500">
                      EGP {actualPrice.toLocaleString()}
                    </p>
                  )}

                  <p className="text-center text-4xl font-black text-slate-900 dark:text-white">
                    EGP {price.toLocaleString()}
                  </p>

                  <ul className="mt-5 flex-1 space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {benefits.map((benefit, index) => (
                      <li key={`${itemId}-${index}`} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-green-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => setSelectedBundleId(itemId)}
                    className={`mt-6 w-full rounded-lg px-4 py-3 text-base font-semibold transition-colors ${
                      isSelected
                        ? "bg-fuchsia-600 text-white hover:bg-fuchsia-500"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {isSelected
                      ? t("selected", "Selected")
                      : t("select-bundle", "Select Bundle")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

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
        onClick={
          !formik.isSubmitting
            ? () => {
                handleSubmit();
                tracking("create_booking", {
                  totalPrice: values.totalPrice,
                });
              }
            : undefined
        }
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
