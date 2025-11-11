import useLocalization from "@/context/localization-provider/localization-context";
import useDateFormat from "@/hooks/useDateFormat";
import usePriceFormat from "@/hooks/usePriceFormat";
import { MailPlus, Phone, View } from "lucide-react";
import { Link } from "react-router-dom";

export default function UsersTables({
  users,
  deleteWorkspace,
  setSelectedUser,
  setIsAddWorkSpaceOpen,
}) {
  const { t } = useLocalization();
  const priceFormat = usePriceFormat();

  const TABLE_HEAD = [
    t("name-0"),
    t("email"),
    t("phone"),
    t("total-spent"),
    t("booking-numbers"),
    t("actions"),
  ];
  const dateFormat = useDateFormat();

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left font-semibold tracking-wider text-gray-600 uppercase"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users?.map((user) => (
              <tr key={user._id} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{user.fullName}</td>

                <td className="px-6 py-4">
                  {user.email ? (
                    <a
                      href={`mailto:${user.email}`}
                      className="hover:text-main inline-flex items-center gap-2 text-gray-700 transition"
                    >
                      <MailPlus className="group-hover:text-main h-4 w-4 text-gray-400" />
                      <span>{user.email}</span>
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">N/A</span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {user.phone ? (
                    <a
                      href={`tel:${user.phone}`}
                      className="hover:text-main inline-flex items-center gap-2 text-gray-700 transition"
                    >
                      <Phone className="group-hover:text-main h-4 w-4 text-gray-400" />
                      <span>{user.phone}</span>
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">N/A</span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {priceFormat(user.userActivity.totalSpent)}
                </td>

                <td className="px-6 py-4 text-center">
                  {user.userActivity.totalBookingTimes}
                </td>

                <td className="px-6 py-4 text-center">
                  <Link
                    to={`${user._id}`}
                    className="text-main hover:text-main/80 inline-flex items-center gap-2 font-medium transition"
                  >
                    View
                    <View className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}

            {users?.length === 0 && (
              <tr>
                <td
                  colSpan={TABLE_HEAD.length}
                  className="py-6 text-center text-gray-500"
                >
                  {t("no-users-found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
