import { useGetActivePromotions } from "@/apis/admin/manage-promotions.api";
import useLocalization from "@/context/localization-provider/localization-context";
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
    <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 backdrop-blur-sm md:gap-3 md:px-5 md:py-2 dark:bg-white/10">
      <Clock className="h-3 w-3 md:h-5 md:w-5" />
      <div className="flex items-center gap-0.5 text-xs font-bold md:gap-1.5 md:text-base lg:text-sm">
        {timeLeft.days > 0 && (
          <>
            <span className="tabular-nums">{timeLeft.days}d</span>
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
function PromotionContent({ promotion, lng }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Create array of text items to rotate through
  const textItems = [
    { text: promotion.title[lng], isBold: true },
    { text: promotion.description[lng], isBold: false },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % textItems.length);
        setIsTransitioning(false);
      }, 300);
    }, 1000);

    return () => clearInterval(interval);
  }, [textItems.length]);

  const currentItem = textItems[currentIndex];

  return (
    <div className="flex flex-1 items-center gap-1.5 overflow-hidden md:gap-3">
      <Sparkles className="h-3 w-3 flex-shrink-0 animate-pulse md:h-5 md:w-5" />
      <p
        className={`truncate text-xs transition-all duration-300 md:text-sm lg:text-base ${
          currentItem.isBold ? "font-bold md:text-base lg:text-lg" : "font-medium"
        } ${isTransitioning ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}
      >
        {currentItem.text}
      </p>
    </div>
  );
}

// Main PromotionsBar Component
export default function PromotionsBar() {
  const { t, lng } = useLocalization();
  const { data, isLoading } = useGetActivePromotions();
  const [isVisible, setIsVisible] = useState(true);

  if (isLoading || !data || data.status !== "success" || !data.data || !isVisible) {
    return null;
  }

  const promotion = data.data;

  return (
    <div className="from-main to-main/70 relative overflow-hidden bg-gradient-to-r text-white shadow-lg transition-none">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 h-32 w-32 animate-pulse rounded-full bg-white blur-3xl"></div>
        <div className="absolute top-0 right-0 h-40 w-40 animate-pulse rounded-full bg-white blur-3xl delay-700"></div>
      </div>

      {/* Content */}
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-2 px-6 py-4 md:gap-4 md:px-8 md:py-2">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 md:gap-3">
          <div className="hidden animate-bounce md:block">
            <Gift className="h-6 w-6 md:h-7 md:w-7" />
          </div>
          <PromotionContent promotion={promotion} lng={lng} />
        </div>

        <div className="flex flex-shrink-0 items-center gap-1 md:gap-3">
          {/* If has timer */}
          {promotion.hasTimer && <CountdownTimer endDate={promotion.end_date} />}

          {/* If has Link */}
          {promotion.hasLink && (
            <Link
              className="text-main rounded bg-white px-8 py-1 text-sm font-bold"
              to={`/offers/${promotion.link}`}
            >
              Book Now
            </Link>
          )}
          <button
            onClick={() => setIsVisible(false)}
            className="rounded-full p-0.5 transition-all hover:bg-white/20 md:p-1"
            aria-label="Close promotion"
          >
            <X className="h-3 w-3 md:h-5 md:w-5" />
          </button>
        </div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>
  );
}
