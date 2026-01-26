import { useGetActivePromotions } from "@/apis/admin/manage-promotions.api";
import { Clock, Gift, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Countdown Timer Component
function CountdownTimer({ endDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!endDate) return;

    const calculateTime = () => {
      const now = new Date();
      const diff = new Date(endDate).getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm md:gap-3 md:px-5 md:py-2.5">
      <Clock className="h-4 w-4 md:h-5 md:w-5" />
      <div className="flex items-center gap-1.5 text-sm font-bold md:text-base lg:text-lg">
        {timeLeft.days > 0 && (
          <>
            <span className="tabular-nums">{timeLeft.days} d</span>
            <span className="opacity-60">:</span>
          </>
        )}
        <span className="tabular-nums">{String(timeLeft.hours).padStart(2, "0")}</span>
        <span className="opacity-60">:</span>
        <span className="tabular-nums">{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span className="opacity-60">:</span>
        <span className="tabular-nums">{String(timeLeft.seconds).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

// Promotion Content Component
function PromotionContent({ promotion }) {
  return (
    <div className="flex flex-1 flex-row gap-3 md:items-center md:gap-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 animate-pulse md:h-5 md:w-5" />
        <span className="text-sm font-bold md:text-base lg:text-lg">
          {promotion.title}
        </span>
      </div>
      <p className="text-xs font-medium md:text-sm lg:text-base">
        {promotion.description}
      </p>
    </div>
  );
}

// Main PromotionsBar Component
export default function PromotionsBar() {
  const { data, isLoading } = useGetActivePromotions();
  const [isVisible, setIsVisible] = useState(true);

  if (isLoading || !data || data.status !== "success" || !data.data || !isVisible) {
    return null;
  }

  const promotion = data.data;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-lg">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 h-32 w-32 animate-pulse rounded-full bg-white blur-3xl"></div>
        <div className="absolute top-0 right-0 h-40 w-40 animate-pulse rounded-full bg-white blur-3xl delay-700"></div>
      </div>

      {/* Content */}
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-3 md:flex-row md:px-6">
        <div className="flex flex-1 items-center gap-3">
          <div className="hidden animate-bounce md:block">
            <Gift className="h-6 w-6 md:h-7 md:w-7" />
          </div>
          <PromotionContent promotion={promotion} />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <CountdownTimer endDate={promotion.end_date} />

          <Link
            to="/booking"
            className="hidden rounded-full bg-white px-4 py-2 text-xs font-semibold text-purple-600 shadow-lg transition-transform hover:scale-105 hover:shadow-xl md:block md:px-6 md:text-sm"
          >
            Book Now
          </Link>

          <button
            onClick={() => setIsVisible(false)}
            className="rounded-full p-1 transition-all hover:bg-white/20"
            aria-label="Close promotion"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>
  );
}
