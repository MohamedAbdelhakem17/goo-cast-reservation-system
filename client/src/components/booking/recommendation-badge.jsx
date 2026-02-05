import { memo } from "react";

/**
 * Badge component to highlight recommended add-ons
 */
const RecommendationBadge = memo(function RecommendationBadge({
  text,
  variant = "default",
}) {
  const variants = {
    default: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    popular: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    group: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    universal: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant] || variants.default}`}
    >
      <i className="fa-solid fa-star text-xs"></i>
      {text}
    </span>
  );
});

export default RecommendationBadge;
