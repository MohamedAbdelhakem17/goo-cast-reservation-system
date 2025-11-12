import useLocalization from "@/context/localization-provider/localization-context";
import useDateFormat from "@/hooks/useDateFormat";
import usePriceFormat from "@/hooks/usePriceFormat";
import {
  Activity,
  ArrowLeft,
  DollarSign,
  Mail,
  MessageCircle,
  Phone,
  Ticket,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function UserProfileHeader({ customer }) {
  // Translation
  const { t } = useLocalization();

  // Hooks
  const dateFormat = useDateFormat();
  const priceFormat = usePriceFormat();

  // Variables
  const email = customer?.email;
  const phone = customer?.phone;
  const whatsappNumber = phone ? `https://wa.me/+20${phone.replace(/^0/, "")}` : null;

  return (
    <div className="w-full border-b border-gray-200 px-4 py-4 sm:px-6">
      {/* Header Top: Back button + Info */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        {/* Back Button */}
        <Link
          to="/admin-dashboard/users"
          className="inline-flex items-center justify-center rounded-md p-2 transition hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700 rtl:-scale-100" />
        </Link>

        {/* User Info */}
        <div className="w-full flex-1">
          {/* Avatar and Name */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-red-600 text-xl font-semibold text-white">
              {customer?.avatar || "NA"}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                {customer?.name}
              </h1>

              {/* Tags */}
              <div className="mt-1 flex flex-wrap gap-2">
                {customer?.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md border border-transparent bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 transition hover:bg-red-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-3 flex flex-col flex-wrap gap-4 text-sm text-gray-600 sm:flex-row">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>
                {t("owner-name", {
                  name: customer?.owner || "N/A",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>
                {t("last-activity", {
                  date: dateFormat(customer.lastBookingTime),
                })}{" "}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>
                {t("spent-price", {
                  price: priceFormat(customer?.totalSpent || 0),
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              <span>
                {t("booking-count", {
                  count: customer?.totalBookingTimes ?? 0,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="mt-4 flex flex-row gap-2">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium transition hover:bg-gray-50"
            >
              <Mail className="h-4 w-4" />
              {t("email")}
            </a>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium transition hover:bg-gray-50"
            >
              <Phone className="h-4 w-4" />
              {t("call")}
            </a>
          )}

          {whatsappNumber && (
            <a
              href={whatsappNumber}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium transition hover:bg-gray-50"
            >
              <MessageCircle className="h-4 w-4" />
              {t("whatsapp")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
