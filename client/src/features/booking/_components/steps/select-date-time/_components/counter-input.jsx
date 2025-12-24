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
    <div className="w-full rounded-xl border border-gray-200 px-4 py-2">
      <div className="mb-1">
        <h4 className="text-main text-base font-bold md:text-lg">{label}</h4>
        {helperText && <p className="text-xs text-gray-500 md:text-sm">{helperText}</p>}
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          onClick={decrement}
          disabled={value <= min}
          className={`flex size-8 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            value <= min
              ? "cursor-not-allowed border-gray-200 text-gray-300"
              : "border-gray-300 text-gray-700 hover:border-[#FF3B30] hover:bg-red-50 hover:text-[#FF3B30] active:scale-95"
          }`}
          aria-label={`Decrease ${label.toLowerCase()}`}
        >
          <Minus className="h-5 w-5" />
        </button>

        <div className="min-w-[80px] text-center">
          <div className="text-2xl font-medium text-gray-900 md:text-3xl">{value}</div>
          <div className="mt-1 text-xs text-gray-500">{displayUnit}</div>
        </div>

        <button
          onClick={increment}
          disabled={value >= max}
          className={`flex size-8 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            value >= max
              ? "cursor-not-allowed border-gray-200 text-gray-300"
              : "border-gray-300 text-gray-700 hover:border-[#FF3B30] hover:bg-red-50 hover:text-[#FF3B30] active:scale-95"
          }`}
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
