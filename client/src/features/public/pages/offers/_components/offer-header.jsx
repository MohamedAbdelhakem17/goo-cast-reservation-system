import { Flame } from "lucide-react";
import FloatingIcon from "./floating-icon";

export default function OfferHeader({
  badge,
  title,
  description,
  actualPrice,
  price,
  discountAmount,
}) {
  const titleParts = title?.split(" ");

  return (
    <div className="relative overflow-hidden p-3 text-center">
      {/* Floating Icons (Hidden on small screens) */}
      <FloatingIcon />

      {/* Badge */}
      <div className="relative z-10 mb-2 inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 sm:px-4 sm:py-2 dark:border-yellow-600 dark:bg-yellow-900/30">
        <Flame className="text-yellow-500 dark:text-yellow-400" size={16} />
        <span className="text-xs font-medium text-yellow-600 sm:text-sm dark:text-yellow-400">
          {badge}
        </span>
      </div>

      {/* Title */}
      <h1 className="relative z-10 my-2 px-2 text-2xl font-bold md:text-6xl">
        <span className="block text-gray-800 dark:text-white">{titleParts?.[0]}</span>
        <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          {titleParts?.slice(1)?.join(" ")}
        </span>
      </h1>

      {/* Description */}
      <p className="relative z-10 mx-auto max-w-xl px-4 text-base leading-relaxed text-gray-500 sm:text-lg md:mt-3 md:max-w-2xl md:text-xl dark:text-gray-400">
        {description}
      </p>

      <div className="relative z-10 mt-4 inline-flex flex-wrap items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white/90 px-5 py-3 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl sm:gap-4 sm:px-6 sm:py-4 dark:border-gray-700 dark:bg-gray-800/90">
        <span className="from-main dark:from-main-dark bg-gradient-to-r to-pink-600 bg-clip-text text-4xl font-black text-transparent sm:text-5xl dark:to-pink-500">
          40% OFF
        </span>

        <div className="hidden h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent sm:block dark:via-gray-600" />

        <div className="flex flex-col items-center gap-1 sm:items-start">
          <span className="border-b border-gray-200 pb-2 text-sm font-semibold text-gray-400 sm:text-base dark:border-gray-700 dark:text-gray-500">
            {price * 4} EGP for 4 Hours
          </span>
          <span className="text-sm font-semibold text-gray-400 sm:text-base dark:text-gray-500">
            {price * 2} EGP for 2 Hours
          </span>
          {/* <span className="rounded-full bg-gradient-to-r from-green-400 to-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-md sm:text-sm">
            Save {discountAmount} EGP
          </span> */}
        </div>
      </div>
    </div>
  );
}
