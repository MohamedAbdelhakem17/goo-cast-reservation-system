import { motion } from "framer-motion";
import useDateFormat from "@/hooks/useDateFormat";
import usePriceFormat from "@/hooks/usePriceFormat";
import useTimeConvert from "@/hooks/useTimeConvert";
import BookingReceiptPDF from "@/features/booking/_components/booking-receipt-pdf";
import useLocalization from "@/context/localization-provider/localization-context";
import { PDFDownloadLink } from "@react-pdf/renderer";

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
  console.log(selectedBooking);
  const { t, lng } = useLocalization();
  const priceFormat = usePriceFormat();
  const convertTo12HourFormat = useTimeConvert();
  const formatDate = useDateFormat();
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
        {/* Modal Header with Studio Image */}
        <div className="relative h-48">
          <img
            src={
              selectedBooking.studio.thumbnail || "/placeholder.svg?height=192&width=672"
            }
            alt={selectedBooking.studio.name?.[lng]}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  {selectedBooking.studio.name?.[lng]}
                </h2>
                <div className="mt-1 flex items-center">
                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium capitalize ${
                      statusClasses[selectedBooking.status]
                    }`}
                  >
                    <i className={`${statusIcons[selectedBooking.status]} text-xs`}></i>
                    {selectedBooking.status}
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

        <div className="p-6">
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <i className="fa-solid fa-calendar-days text-main mb-2 text-xl"></i>
                <p className="text-xs text-gray-500">{t("date-0")}</p>
                <p className="font-medium">{formatDate(selectedBooking.date, "short")}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <i className="fa-solid fa-clock text-main mb-2 text-xl"></i>
                <p className="text-xs text-gray-500">{t("time-0")}</p>
                <p className="font-medium">
                  {convertTo12HourFormat(selectedBooking.startSlot)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <i className="fa-solid fa-hourglass-half text-main mb-2 text-xl"></i>
                <p className="text-xs text-gray-500">{t("duration-0")}</p>
                <p className="font-medium">{selectedBooking.duration} hours</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <i className="fa-solid fa-users text-main mb-2 text-xl"></i>
                <p className="text-xs text-gray-500">{t("persons")}</p>
                <p className="font-medium">{selectedBooking.persons}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-user-circle text-main me-2"></i>
                {t("personal-information")}
              </h3>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500">{t("full-name")}</p>
                    <p className="font-medium">{selectedBooking.personalInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t("email")}</p>
                    <p className="leading-snug font-medium break-words">
                      {selectedBooking.personalInfo.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t("phone")}</p>
                    <p className="font-medium">{selectedBooking.personalInfo.phone}</p>
                  </div>
                  {selectedBooking.personalInfo.brand && (
                    <div>
                      <p className="text-xs text-gray-500">{t("brand")}</p>
                      <p className="font-medium">{selectedBooking.personalInfo.brand}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedBooking.package && (
              <div>
                <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-800">
                  <i className="fa-solid fa-box text-main me-2"></i>
                  {t("package-details")}
                </h3>
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">
                        {selectedBooking.package.name?.[lng]}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{t("total-package-price")}:</span>
                      <span className="font-medium">
                        {priceFormat(selectedBooking?.totalPackagePrice || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedBooking.addOns && selectedBooking.addOns.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-800">
                  <i className="fa-solid fa-puzzle-piece text-main me-2"></i>
                  {t("add-ons")}
                </h3>
                <div className="rounded-xl bg-gray-50 p-4">
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
                          Quantity: {addon?.quantity}
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
                        {priceFormat(selectedBooking?.totalAddOnsPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-receipt text-main me-2"></i>
                {t("payment-summary")}
              </h3>
              <div className="space-y-2 rounded-xl bg-gray-50 p-4">
                {selectedBooking.package && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t("package-price")}:</span>
                    <span className="text-gray-600">
                      {priceFormat(selectedBooking.totalPackagePrice || 0)}
                    </span>
                  </div>
                )}
                {selectedBooking.totalAddOnsPrice > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t("add-ons-price")}:</span>
                    <span className="text-gray-600">
                      {priceFormat(selectedBooking.totalAddOnsPrice)}
                    </span>
                  </div>
                )}
                <div className="mt-1 border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">
                      {t("total-price-0")}:
                    </span>
                    <span className="text-main text-xl font-bold">
                      {priceFormat(selectedBooking.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
