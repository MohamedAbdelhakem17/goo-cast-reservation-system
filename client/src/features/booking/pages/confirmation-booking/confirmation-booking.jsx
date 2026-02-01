import useLocalization from "@/context/localization-provider/localization-context";
import useDateFormat from "@/hooks/useDateFormat";
import usePriceFormat from "@/hooks/usePriceFormat";
import useTimeConvert from "@/hooks/useTimeConvert";
import { trackBookingStep } from "@/utils/gtm";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { motion } from "framer-motion";
import {
  Calendar,
  Check,
  Clock,
  CreditCard,
  Download,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { lazy, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BookingReceiptPDF = lazy(() => import("./../../_components/booking-receipt-pdf"));

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  }),
};

const iconPop = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 10, delay: 0.2 },
  },
};

// eslint-disable-next-line no-unused-vars
function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center space-x-3">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
      <div className="flex-1">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <p className="font-medium break-words text-gray-900 dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  );
}

const PriceRow = ({ label, value, bold = false }) => (
  <div className="flex items-center justify-between py-2">
    <span
      className={`text-gray-600 dark:text-gray-400 ${bold ? "text-lg font-semibold text-gray-900 dark:text-gray-100" : ""}`}
    >
      {label}
    </span>
    <span
      className={`font-medium ${bold ? "text-lg font-bold text-gray-900 dark:text-gray-100" : ""}`}
    >
      {value}
    </span>
  </div>
);

export default function BookingConfirmation() {
  // Localization
  const { t, lng } = useLocalization();

  // Navigation
  const navigate = useNavigate();

  // Stet
  const bookingData =
    JSON.parse(localStorage.getItem("bookingConfirmation"))?.bookingResponse || null;

  // Hooks
  const priceFormat = usePriceFormat();
  const dateFormat = useDateFormat();
  const formatTime = useTimeConvert();

  // Variables
  const subtotal = useMemo(() => {
    return bookingData?.totalPackagePrice + bookingData?.totalAddOnsPrice;
  }, [bookingData?.totalPackagePrice, bookingData?.totalAddOnsPrice]);

  const purchaseTracked = useRef(false);

  // Effect
  useEffect(() => {
    localStorage.removeItem("bookingStep");
    localStorage.removeItem("bookingData");
  }, []);

  useEffect(() => {
    if (!bookingData) navigate("/booking", { replace: true });
  }, [bookingData, navigate]);

  useEffect(() => {
    if (!bookingData?.totalPrice) return;
    if (purchaseTracked.current) return;

    purchaseTracked.current = true;

    trackBookingStep("purchase", {
      step_slug: "Complete purchase",
      value: Number(bookingData.totalPriceAfterDiscount || bookingData.totalPrice) || 0,
      currency: "EGP",
      transaction_id: bookingData._id,
      contents: [
        bookingData?.package && {
          id: bookingData.package._id,
          quantity: 1,
          item_price: bookingData.totalPackagePrice,
        },
        ...bookingData.addOns.map((addOn) => ({
          id: addOn.item,
          quantity: addOn.quantity,
          item_price: addOn.price,
        })),
      ].filter(Boolean),
      content_type: "product",
    });
  }, [bookingData]);

  if (!bookingData) return null;

  return (
    <div className="my-4 mt-8 min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8 dark:bg-gray-950">
      <motion.div
        className="mx-auto mt-4 max-w-6xl space-y-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {/* Header */}
        <motion.div className="mb-8 text-center" variants={fadeInUp}>
          <motion.div
            className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
            variants={iconPop}
          >
            <Check className="h-8 w-8 text-green-600" />
          </motion.div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("booking-confirmed")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("your-studio-session-has-been-successfully-booked")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Booking Reference */}
            <motion.div
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              variants={fadeInUp}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <div className="mb-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {t("booking-reference")}
                </h2>
                <span className="text-md rounded-md bg-gray-300 px-3 py-2 font-bold text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                  {bookingData?._id}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t(
                  "please-keep-this-reference-number-for-your-records-youll-need-it-for-any-changes-or-inquiries",
                )}
              </p>
            </motion.div>

            {/* Session Details */}
            <motion.div
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              variants={fadeInUp}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Session Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">
                      {t("service")}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {bookingData?.package?.name?.[lng]}
                    </span>
                  </div>
                  <DetailRow
                    icon={MapPin}
                    label={t("studio")}
                    value={bookingData?.studio?.name?.[lng]}
                  />
                </div>
                <DetailRow
                  icon={Calendar}
                  label={t("date-0")}
                  value={dateFormat(bookingData?.date)}
                />
                <DetailRow
                  icon={Clock}
                  label={t("time-and-duration")}
                  value={`${formatTime(bookingData?.startSlot)} (${
                    bookingData?.duration
                  }h)`}
                />
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              variants={fadeInUp}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t("contact-information")}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailRow
                  icon={User}
                  label={t("name-0")}
                  value={bookingData?.personalInfo?.fullName}
                />
                <DetailRow
                  icon={Phone}
                  label={t("phone")}
                  value={bookingData?.personalInfo?.phone}
                />
                <DetailRow
                  icon={Mail}
                  label={t("email")}
                  value={bookingData?.personalInfo?.email}
                />
                <DetailRow
                  icon={CreditCard}
                  label={t("payment-method")}
                  value={bookingData?.paymentMethod}
                />
              </div>
            </motion.div>

            {/* Important Info */}
            <motion.div
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              variants={fadeInUp}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t("important-information")}
              </h2>

              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
                <h3 className="mb-2 font-medium text-blue-900 dark:text-blue-100">
                  {t("before-your-session")}
                </h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>{t("arrive-30-minutes-early-for-setup")}</li>
                  <li>{t("bring-a-valid-id-for-check-in")}</li>
                  <li>{t("review-our-studio-guidelines-and-policies")}</li>
                </ul>
              </div>

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
                <h3 className="mb-2 font-medium text-yellow-900 dark:text-yellow-100">
                  {t("cancellation-policy")}
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {t(
                    "free-cancellation-up-to-24-hours-before-your-session-cancellations-within-24-hours-may-incur-a-50-fee",
                  )}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Price Summary */}
            <motion.div
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              variants={fadeInUp}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t("price-summary")}
              </h2>
              <div className="space-y-3 divide-y divide-gray-200 dark:divide-gray-700">
                <PriceRow
                  label={bookingData?.package?.name?.[lng]}
                  value={priceFormat(bookingData?.totalPackagePrice)}
                />
                <div>
                  <PriceRow label={t("subtotal")} value={priceFormat(subtotal)} />
                  {/* If discount  */}
                  {bookingData.totalPriceAfterDiscount !== bookingData.totalPrice && (
                    <PriceRow
                      label={t("discount-1")}
                      value={priceFormat(
                        +bookingData.totalPrice - bookingData.totalPriceAfterDiscount,
                      )}
                    />
                  )}

                  <div className="text-md flex justify-between text-gray-600"></div>
                </div>
                <div className="pt-3">
                  <PriceRow
                    label={t("total")}
                    value={priceFormat(
                      bookingData.totalPriceAfterDiscount || bookingData.totalPrice,
                    )}
                    bold={true}
                  />
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              variants={fadeInUp}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t("quick-actions")}
              </h2>
              <div>
                <PDFDownloadLink
                  document={<BookingReceiptPDF booking={bookingData} t={t} lng={lng} />}
                  fileName="booking-receipt.pdf"
                >
                  {({ loading }) => (
                    <motion.button className="my-2 flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                      <Download className="h-4 w-4" />
                      <span>{loading ? t("loading-0") : t("download-receipt")}</span>
                    </motion.button>
                  )}
                </PDFDownloadLink>

                <motion.button
                  className="my-2 w-full rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
                  onClick={() => {
                    localStorage.removeItem("bookingData");
                    localStorage.removeItem("bookingStep");
                    localStorage.removeItem("bookingConfirmation");
                    navigate("/booking");
                  }}
                >
                  {t("book-another-session")}
                </motion.button>
              </div>
            </motion.div>

            {/* Need Help */}
            <motion.div
              className="rounded-lg border border-gray-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              variants={fadeInUp}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t("need-help")}
              </h2>
              <div className="space-y-3 text-sm">
                <DetailRow icon={Phone} label={t("studio-phone")} value="01010955331" />
                <DetailRow
                  icon={Mail}
                  label={t("email-support")}
                  value="studio@goocast.net"
                />
                <DetailRow
                  icon={MapPin}
                  label={t("studio-address")}
                  value={t("8-abd-el-rahman-fahmy-qasr-el-nile-garden-city")}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
