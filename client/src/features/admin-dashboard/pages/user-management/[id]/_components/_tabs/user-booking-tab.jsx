import { ResponsiveTable, Table } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import useDateFormat from "@/hooks/useDateFormat";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import usePriceFormat from "@/hooks/usePriceFormat";
import { motion } from "framer-motion";

export default function UserBookingTab({ allUserBooking, name, email }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Translation & formatting
  const { t, lng } = useLocalization();
  const formatDate = useDateFormat();
  const formatPrice = usePriceFormat();

  const TABLE_HEADERS = [
    t("personal-info"),
    t("studio-0"),
    t("date"),
    t("total-price"),
    t("status"),
  ];

  return (
    <>
      {isDesktop ? (
        <Table headers={TABLE_HEADERS}>
          {allUserBooking.map((booking) => (
            <motion.tr
              key={booking._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="transition-all hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{name}</div>
                <div className="text-sm break-words text-gray-500">{email}</div>
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                {booking?.studio?.name?.[lng] || t("studio-name")}
              </td>

              <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                {formatDate(booking.date)}
              </td>

              <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                {formatPrice(booking.totalPriceAfterDiscount || booking.totalPrice)}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold`}
                >
                  {booking.status}
                </span>
              </td>
            </motion.tr>
          ))}
        </Table>
      ) : (
        allUserBooking.map((booking) => (
          <ResponsiveTable
            key={booking._id}
            title={`${booking?.studio?.name?.[lng] || t("studio-name")} booking`}
            subtitle={booking.status}
            fields={[
              {
                label: t("price"),
                value: formatPrice(booking.totalPriceAfterDiscount || booking.totalPrice),
              },
              { label: t("date-0"), value: formatDate(booking.date) },

              { label: t("duration"), value: `${booking.duration} ${t("hour-s")}` },
              { label: t("user-name"), value: name },
              { label: t("user-email"), value: email },
            ]}
          />
        ))
      )}
    </>
  );
}
