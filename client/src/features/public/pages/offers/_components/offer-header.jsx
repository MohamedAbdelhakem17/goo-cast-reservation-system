import { Flame } from "lucide-react";
import FloatingIcon from "./floating-icon";

export default function OfferHeader({ badge, title, description, onBookNow }) {
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
      <p className="relative z-10 mx-auto max-w-xl px-4 text-base leading-relaxed text-gray-500 sm:text-lg md:mt-6 md:max-w-2xl md:text-xl dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
