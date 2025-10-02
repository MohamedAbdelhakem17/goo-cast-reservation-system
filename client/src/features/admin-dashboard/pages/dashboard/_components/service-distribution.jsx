import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import MatrixCard from "./matrix-card";
import useLocalization from "@/context/localization-provider/localization-context";
import useNumberFormat from "@/hooks/use-number-format";

const RED_GRADIENT = ["#DC2626", "#EF4444", "#F87171"];

export default function ServiceDistribution({ data, children }) {
  // Localization
  const { lng, t } = useLocalization();

  // Hooks
  const numberFormat = useNumberFormat();

  return (
    <MatrixCard className={"p-4 sm:col-span-2 lg:col-span-2"}>
      {children}

      <div dir="ltr">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              dataKey="count"
              label={({ label, percentage }) =>
                t("service-percentage", {
                  label: label?.[lng],
                  percentage: numberFormat(percentage),
                })
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={RED_GRADIENT[index % RED_GRADIENT.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </MatrixCard>
  );
}
