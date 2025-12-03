import useLocalization from "@/context/localization-provider/localization-context";
import useDateFormat from "@/hooks/useDateFormat";
import usePriceFormat from "@/hooks/usePriceFormat";
import useTimeConvert from "@/hooks/useTimeConvert";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Calendar, Mail } from "lucide-react";
import BookingReceiptPDF from "../../../features/booking/_components/booking-receipt-pdf";

export default function DetailsTab({ booking }) {
  const { lng, t } = useLocalization();

  const formatDate = useDateFormat();
  const priceFormat = usePriceFormat();
  const convertTo12HourFormat = useTimeConvert();

  if (!booking) return null;
  return (
    <div className="p-2">
      {/* Actions */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <button
          className="text-main hover:bg-main/90 border-main flex items-center justify-center rounded-xl border-1 px-6 py-1 transition hover:text-white"
          onClick={() => {
            console.log("Click");
          }}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Reschedule
        </button>

        <button className="text-main hover:bg-main/90 border-main flex items-center justify-center rounded-xl border-1 px-6 py-1 transition hover:text-white">
          <Mail className="mr-2 h-4 w-4" />
          Send Confirmation
        </button>

        <button className="text-main hover:bg-main/90 border-main flex items-center justify-center rounded-xl border-1 px-6 py-1 transition hover:text-white">
          Cancel Booking
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <InfoCard
            icon="fa-calendar-days"
            label={t("date-0")}
            value={formatDate(booking?.date, "short")}
          />
          <InfoCard
            icon="fa-clock"
            label={t("time-0")}
            value={convertTo12HourFormat(booking?.startSlot)}
          />
          <InfoCard
            icon="fa-hourglass-half"
            label={t("duration-0")}
            value={`${booking?.duration || 0} ${t("hours")}`}
          />
          <InfoCard icon="fa-users" label={t("persons")} value={booking?.persons || 0} />
        </div>

        {/* Package */}
        {booking?.package && (
          <Section title={t("package-details")} icon="fa-box">
            <div className="mb-3">
              <p className="text-lg font-medium">{booking?.package?.name?.[lng]}</p>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("total-package-price")}:</span>
                <span className="font-medium">
                  {priceFormat(booking?.totalPackagePrice || 0)}
                </span>
              </div>
            </div>
          </Section>
        )}

        {/* Add-ons */}
        {booking?.addOns?.length > 0 && (
          <Section title={t("add-ons")} icon="fa-puzzle-piece">
            {booking.addOns.map((addon, index) => (
              <div
                key={index}
                className={`flex items-center justify-between py-2 ${
                  index !== booking.addOns.length - 1 ? "border-b border-gray-200" : ""
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
                  {priceFormat(booking?.totalAddOnsPrice || 0)}
                </span>
              </div>
            </div>
          </Section>
        )}

        {/* Payment */}
        <Section title={t("payment-summary")} icon="fa-receipt">
          {booking?.package && (
            <Line
              label={t("package-price")}
              value={priceFormat(booking?.totalPackagePrice || 0)}
            />
          )}

          {booking?.totalAddOnsPrice > 0 && (
            <Line
              label={t("add-ons-price")}
              value={priceFormat(booking?.totalAddOnsPrice)}
            />
          )}

          {booking?.totalPriceAfterDiscount < booking?.totalPrice && (
            <Line
              label={t("discount")}
              value={`${priceFormat(
                (booking?.totalPrice || 0) - (booking?.totalPriceAfterDiscount || 0),
              )} -`}
              className="text-red-600"
            />
          )}

          <div className="mt-1 border-t border-gray-200 pt-3">
            <Line
              label={t("total-price-0")}
              value={priceFormat(
                booking?.totalPriceAfterDiscount || booking?.totalPrice || 0,
              )}
              bold
              main
            />
          </div>
        </Section>
      </div>

      {/* Footer */}
      <PDFDownloadLink
        document={<BookingReceiptPDF booking={booking} />}
        fileName="booking-receipt.pdf"
      >
        {({ loading }) => (
          <button className="bg-main hover:bg-main/90 mt-2 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-white transition">
            <i className="fa-solid fa-download"></i>
            {loading ? t("preparing") : t("download-receipt")}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
}

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
