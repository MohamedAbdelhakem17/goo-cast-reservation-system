import MatrixCard from "./matrix-card";
import useLocalization from "@/context/localization-provider/localization-context";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import useNumberFormat from "@/hooks/use-number-format";

const arabicMonths = {
  Jan: "يناير",
  Feb: "فبراير",
  Mar: "مارس",
  Apr: "أبريل",
  May: "مايو",
  Jun: "يونيو",
  Jul: "يوليو",
  Aug: "أغسطس",
  Sep: "سبتمبر",
  Oct: "أكتوبر",
  Nov: "نوفمبر",
  Dec: "ديسمبر",
};

export default function RevenueTrends({ revenueTrends }) {
  const { t, lng } = useLocalization();
  const numberFormat = useNumberFormat();

  return (
    <MatrixCard className="p-4 sm:col-span-2 lg:col-span-2">
      {/* Title */}
      <h2 className="text-md font-bold">{t("revenue-trends")}</h2>

      {/* Description */}
      <p className="mb-4 text-sm text-gray-500">{t("monthly-revenue-over-time-egp")}</p>

      <div dir="ltr">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(month) => (lng === "ar" ? arabicMonths[month] : month)}
            />
            <YAxis tickFormatter={(value) => numberFormat(value)} />
            <Line
              type="monotone"
              dataKey="totalRevenue"
              stroke="#DC2626"
              strokeWidth={3}
              dot={{ fill: "#DC2626", r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </MatrixCard>
  );
}
