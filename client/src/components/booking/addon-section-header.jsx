import { memo } from "react";

/**
 * Section header for grouping add-ons
 */
const AddonSectionHeader = memo(function AddonSectionHeader({ title, icon, count }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {icon && <i className={`${icon} text-main text-xl`}></i>}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {count > 0 && (
        <span className="bg-main/10 text-main flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
          {count}
        </span>
      )}
    </div>
  );
});

export default AddonSectionHeader;
