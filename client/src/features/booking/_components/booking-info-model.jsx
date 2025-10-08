import { motion } from "framer-motion";
import useDateFormat from "@/hooks/useDateFormat";
import usePriceFormat from "@/hooks/usePriceFormat";
import useTimeConvert from "@/hooks/useTimeConvert";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BookingReceiptPDF from "./booking-receipt-pdf";
import useLocalization from "@/context/localization-provider/localization-context";
import { useMemo } from "react";
import { Buffer } from "buffer";
window.Buffer = Buffer;

const statusClasses = {
  approved: "bg-gradient-to-r from-green-500 to-green-600 text-white",
  pending: "bg-gradient-to-r from-amber-400 to-amber-500 text-white",
  rejected: "bg-gradient-to-r from-red-500 to-red-600 text-white",
};

const statusIcons = {
  approved: "fa-solid fa-circle-check",
  pending: "fa-solid fa-clock",
  rejected: "fa-solid fa-circle-xmark",
};

export default function BookingInfoModel({ selectedBooking, setSelectedBooking }) {
  const { t, lng } = useLocalization();
  const priceFormat = usePriceFormat();
  const convertTo12HourFormat = useTimeConvert();
  const formatDate = useDateFormat();

  if (!selectedBooking) return null;

  const pdfDocument = useMemo(
    () => <BookingReceiptPDF booking={selectedBooking} />,
    [selectedBooking],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => setSelectedBooking(null)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white shadow-xl md:max-w-[60%]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-48">
          <img
            src={selectedBooking?.studio?.thumbnail || "/images/placeholder.png"}
            alt={selectedBooking?.studio?.name?.[lng] || "Studio"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  {selectedBooking?.studio?.name?.[lng] || t("unknown-studio")}
                </h2>
                <div className="mt-1 flex items-center">
                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium capitalize ${
                      statusClasses[selectedBooking?.status] || "bg-gray-400 text-white"
                    }`}
                  >
                    <i
                      className={`${
                        statusIcons[selectedBooking?.status] || "fa-solid fa-circle-info"
                      } text-xs`}
                    ></i>
                    {selectedBooking?.status || t("unknown")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="h-8 w-8 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/30"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <InfoCard
                icon="fa-calendar-days"
                label={t("date-0")}
                value={formatDate(selectedBooking?.date, "short")}
              />
              <InfoCard
                icon="fa-clock"
                label={t("time-0")}
                value={convertTo12HourFormat(selectedBooking?.startSlot)}
              />
              <InfoCard
                icon="fa-hourglass-half"
                label={t("duration-0")}
                value={`${selectedBooking?.duration || 0} ${t("hours")}`}
              />
              <InfoCard
                icon="fa-users"
                label={t("persons")}
                value={selectedBooking?.persons || 0}
              />
            </div>

            {/* Personal Info */}
            <Section title={t("personal-information")} icon="fa-user-circle">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label={t("full-name")}
                  value={selectedBooking?.personalInfo?.fullName}
                />
                <Field label={t("email")} value={selectedBooking?.personalInfo?.email} />
                <Field label={t("phone")} value={selectedBooking?.personalInfo?.phone} />
                {selectedBooking?.personalInfo?.brand && (
                  <Field
                    label={t("brand")}
                    value={selectedBooking?.personalInfo?.brand}
                  />
                )}
              </div>
            </Section>

            {/* Package */}
            {selectedBooking?.package && (
              <Section title={t("package-details")} icon="fa-box">
                <div className="mb-3">
                  <p className="text-lg font-medium">
                    {selectedBooking?.package?.name?.[lng]}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t("total-package-price")}:</span>
                    <span className="font-medium">
                      {priceFormat(selectedBooking?.totalPackagePrice || 0)}
                    </span>
                  </div>
                </div>
              </Section>
            )}

            {/* Add-ons */}
            {selectedBooking?.addOns?.length > 0 && (
              <Section title={t("add-ons")} icon="fa-puzzle-piece">
                {selectedBooking.addOns.map((addon, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between py-2 ${
                      index !== selectedBooking.addOns.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium">{addon?.item?.name?.[lng]}</p>
                      <p className="text-sm text-gray-500">
                        {t("quantity")}: {addon?.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{t("price")}</p>
                      <p className="font-medium">{priceFormat(addon?.price)}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-3 border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t("total-add-ons")}:</span>
                    <span className="font-medium">
                      {priceFormat(selectedBooking?.totalAddOnsPrice || 0)}
                    </span>
                  </div>
                </div>
              </Section>
            )}

            {/* Payment */}
            <Section title={t("payment-summary")} icon="fa-receipt">
              {selectedBooking?.package && (
                <Line
                  label={t("package-price")}
                  value={priceFormat(selectedBooking?.totalPackagePrice || 0)}
                />
              )}
              {selectedBooking?.totalAddOnsPrice > 0 && (
                <Line
                  label={t("add-ons-price")}
                  value={priceFormat(selectedBooking?.totalAddOnsPrice)}
                />
              )}
              <div className="mt-1 border-t border-gray-200 pt-3">
                <Line
                  label={t("total-price-0")}
                  value={priceFormat(selectedBooking?.totalPrice || 0)}
                  bold
                  main
                />
              </div>
            </Section>
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row">
            <button
              onClick={() => setSelectedBooking(null)}
              className="rounded-xl bg-gray-200 px-6 py-3 text-gray-800 transition hover:bg-gray-300"
            >
              {t("close")}
            </button>
            <PDFDownloadLink
              document={<BookingReceiptPDF booking={selectedBooking} />}
              fileName="booking-receipt.pdf"
            >
              {({ loading }) => (
                <button className="bg-main hover:bg-main/90 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-white transition">
                  <i className="fa-solid fa-download"></i>
                  {loading ? t("preparing") : t("download-receipt")}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ==== Helper Components ==== */

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 text-center">
      <i className={`fa-solid ${icon} text-main mb-2 text-xl`}></i>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div>
      <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-800">
        <i className={`fa-solid ${icon} text-main me-2`}></i>
        {title}
      </h3>
      <div className="rounded-xl bg-gray-50 p-4">{children}</div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium break-words">{value || "-"}</p>
    </div>
  );
}

function Line({ label, value, bold = false, main = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`${bold ? "font-semibold" : "text-gray-600"}`}>{label}:</span>
      <span
        className={`${main ? "text-main text-xl font-bold" : "text-gray-600"} ${
          bold ? "font-semibold" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
