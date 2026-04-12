import { Check, Mic, Sparkles, Video } from "lucide-react";

const HEADER_THEMES = [
  "from-blue-500 to-blue-700",
  "from-fuchsia-500 to-purple-600",
  "from-indigo-500 to-violet-700",
];

const BUNDLE_ICONS = [Video, Sparkles, Mic];

const getBundleId = (bundle) => bundle?._id || bundle?.id;

export default function OfferBundleCard({ item, index, lng, t, isSelected, onSelect }) {
  const itemId = getBundleId(item);
  const bundleName = item?.name?.[lng] || item?.name?.en || t("bundle", "Bundle");
  const bundleDescription = item?.description?.[lng] || item?.description?.en || "";

  const price = Number(item?.price || 0);
  const actualPrice = Number(item?.bundle_actual_price || 0);
  const hasActualPrice = actualPrice > 0;

  const Icon = BUNDLE_ICONS[index % BUNDLE_ICONS.length];
  const theme = HEADER_THEMES[index % HEADER_THEMES.length];

  const postSessionBenefits = (item?.post_session_benefits?.[lng] || []).filter(Boolean);
  const details = (item?.details?.[lng] || []).filter(Boolean);

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all dark:bg-slate-900 ${
        isSelected
          ? "border-main/40 ring-2 ring-main/30 dark:border-main dark:ring-main/30"
          : "border-slate-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800"
      }`}
    >
      <div
        className={`relative flex h-56 flex-col items-center justify-center bg-gradient-to-br px-6 py-8 text-white md:h-60 md:px-7 md:py-9 ${theme}`}
      >
        <div className="mb-5 rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
          <Icon className="h-6 w-6" />
        </div>

        <h3 className="text-center text-3xl font-extrabold">{bundleName}</h3>
        <p className="mt-2 line-clamp-2 text-center text-sm text-white/90">
          {bundleDescription || t("most-popular", "Most Popular")}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-2 md:p-3">
        {hasActualPrice && (
          <p className="text-center text-base font-semibold text-slate-400 line-through dark:text-slate-500">
            EGP {actualPrice.toLocaleString()}
          </p>
        )}

        <p className="text-center text-4xl font-black text-slate-900 dark:text-white">
          EGP {price.toLocaleString()}
        </p>

        <div className="mt-2 flex-1 space-y-5">
          {postSessionBenefits.length > 0 && (
              <ul className="space-y-2.5  ">
                {postSessionBenefits.map((benefit, benefitIndex) => (
                  <li
                    key={`${itemId}-post-${benefitIndex}`}
                    className="flex w-full items-start gap-2 pb-2.5 text-sm leading-6 text-slate-800 last:pb-0  dark:text-slate-100"
                  >
                    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
          )}

          {details.length > 0 && (
            <section className="border-t border-slate-200 pt-4 dark:border-slate-700">
              <ul className="space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                {details.map((detail, detailIndex) => (
                  <li key={`${itemId}-detail-${detailIndex}`} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelect(itemId)}
          className={`mt-6 w-full rounded-lg px-4 py-3 text-base font-semibold transition-colors ${
            isSelected
              ? "bg-main text-white hover:bg-main/50"
              : "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          {isSelected ? t("selected-0", "Selected") : t("select-bundle", "Select Bundle")}
        </button>
      </div>
    </article>
  );
}
