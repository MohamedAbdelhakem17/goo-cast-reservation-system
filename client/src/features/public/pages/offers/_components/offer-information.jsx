import useLocalization from "@/context/localization-provider/localization-context";
import { BadgeCheck, CalendarCheck, Flame, Sparkles } from "lucide-react";

const icons = [Sparkles, BadgeCheck, CalendarCheck, Flame];

export default function OfferInformation({ information }) {
  const { t } = useLocalization();

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {t("whatsIncluded", "What's Included")}
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {information?.map((item, index) => {
          const Icon = icons[index % icons.length];

          return (
            <div
              key={index}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Icon */}
              <div className="rounded-full bg-pink-100 p-3 dark:bg-pink-900/30">
                <Icon className="h-6 w-6 text-pink-500 dark:text-pink-300" />
              </div>

              {/* Label */}
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {item}
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}
