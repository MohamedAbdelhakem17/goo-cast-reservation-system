import { memo } from "react";

/**
 * Component to display the reason why an add-on is recommended
 */
const RecommendationReason = memo(function RecommendationReason({ reason }) {
  if (!reason) return null;

  return (
    <div className="mt-2 flex items-start gap-2 rounded-lg bg-blue-50 p-2.5 dark:bg-blue-900/20">
      <i className="fa-solid fa-lightbulb mt-0.5 text-sm text-blue-600 dark:text-blue-400"></i>
      <p className="text-xs leading-relaxed text-blue-700 dark:text-blue-300">{reason}</p>
    </div>
  );
});

export default RecommendationReason;
