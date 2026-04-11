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

  const benefits = [
    ...(item?.post_session_benefits?.[lng] || []),
    ...(item?.details?.[lng] || []),
  ].filter(Boolean);

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all dark:bg-slate-900 ${
        isSelected
          ? "border-fuchsia-400 ring-4 ring-fuchsia-200/70 dark:border-fuchsia-400 dark:ring-fuchsia-900/40"
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

      <div className="flex flex-1 flex-col p-7 md:p-8">
        {hasActualPrice && (
          <p className="text-center text-base font-semibold text-slate-400 line-through dark:text-slate-500">
            EGP {actualPrice.toLocaleString()}
          </p>
        )}

        <p className="text-center text-4xl font-black text-slate-900 dark:text-white">
          EGP {price.toLocaleString()}
        </p>

        <ul className="mt-5 flex-1 space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
          {benefits.map((benefit, benefitIndex) => (
            <li key={`${itemId}-${benefitIndex}`} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-green-500" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => onSelect(itemId)}
          className={`mt-6 w-full rounded-lg px-4 py-3 text-base font-semibold transition-colors ${
            isSelected
              ? "bg-fuchsia-600 text-white hover:bg-fuchsia-500"
              : "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          {isSelected ? t("selected", "Selected") : t("select-bundle", "Select Bundle")}
        </button>
      </div>
    </article>
  );
}
