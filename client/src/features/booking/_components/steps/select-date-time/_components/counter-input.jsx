import { Minus, Plus } from "lucide-react";

export default function CounterInput({
  label,
  value,
  unit,
  unitPlural,
  min,
  max,
  helperText,
  increment,
  decrement,
}) {
  const displayUnit = value === 1 ? unit : unitPlural || unit;

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white px-2 py-4 md:px-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-1 min-h-[60px]">
        <h4 className="text-main aspect-auto text-base font-bold md:text-lg">{label}</h4>
        {helperText && (
          <p className="text-xs text-gray-500 md:text-sm dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          onClick={decrement}
          disabled={value <= min}
          className={`flex size-6 items-center justify-center rounded-full border-2 transition-all duration-200 md:size-8 ${
            value <= min
              ? "cursor-not-allowed border-gray-200 text-gray-300 dark:border-gray-700 dark:text-gray-600"
              : "border-gray-300 text-gray-700 hover:border-[#FF3B30] hover:bg-red-50 hover:text-[#FF3B30] active:scale-95 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-red-900/20"
          }`}
          aria-label={`Decrease ${label.toLowerCase()}`}
        >
          <Minus className="size-3 md:size-5" />
        </button>

        <div className="min-w-[50px] text-center md:min-w-[80px]">
          <div className="text-2xl font-medium text-gray-900 md:text-3xl dark:text-gray-100">
            {value}
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {displayUnit}
          </div>
        </div>

        <button
          onClick={increment}
          disabled={value >= max}
          className={`flex size-6 items-center justify-center rounded-full border-2 transition-all duration-200 md:size-8 ${
            value >= max
              ? "cursor-not-allowed border-gray-200 text-gray-300 dark:border-gray-700 dark:text-gray-600"
              : "border-gray-300 text-gray-700 hover:border-[#FF3B30] hover:bg-red-50 hover:text-[#FF3B30] active:scale-95 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-red-900/20"
          }`}
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          <Plus className="size-3 md:size-5" />
        </button>
      </div>
    </div>
  );
}
