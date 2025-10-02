import useTimeConvert from "@/hooks/useTimeConvert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import MatrixCard from "./matrix-card";
import useNumberFormat from "@/hooks/use-number-format";
import useLocalization from "@/context/localization-provider/localization-context";

export default function PeakBookingHours({ peakBookingHours }) {
  // Localizations
  const { t } = useLocalization();

  // Hooks
  const timeFormat = useTimeConvert();
  const numberFormat = useNumberFormat();

  return (
    <MatrixCard className={"p-4 sm:col-span-2 lg:col-span-2"}>
      {/* Title */}
      <h2 className="text-md text-start font-bold">{t("peak-booking-hours")}</h2>

      {/* Description */}
      <p className="mb-4 text-start text-sm text-gray-500">
        {t("busiest-times-of-the-day")}
      </p>

      <div dir="ltr">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={peakBookingHours} layout="horizontal" barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tickFormatter={(hour) => timeFormat(hour)} />
            <YAxis
              allowDecimals={false}
              domain={[0, "dataMax"]}
              tickFormatter={(count) => numberFormat(count)}
            />
            <Bar dataKey="count" fill="#DC2626" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </MatrixCard>
  );
}
