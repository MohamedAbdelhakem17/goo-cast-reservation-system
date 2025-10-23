import React from "react";
import { Calendar, Clock, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import useLocalization from "@/context/localization-provider/localization-context";

export default function BookNow() {
  const { t } = useLocalization();

  // Array of features
  const features = [
    {
      icon: Calendar,
      title: t("flexible-scheduling"),
      description: t("book-your-preferred-date-and-time"),
    },
    {
      icon: Mic,
      title: t("professional-equipment"),
      description: t("high-quality-audio-and-video-gear"),
    },
    {
      icon: Clock,
      title: t("quick-turnaround"),
      description: t("get-your-content-ready-to-publish-fast"),
    },
  ];

  return (
    <div className="from-main to-main/70 my-12 bg-gradient-to-r p-12 text-white md:rounded-xl">
      {/* Header */}
      <div className="mx-auto max-w-[90%] text-center">
        {/* Title */}
        <h3 className="mb-4 text-2xl font-bold md:text-3xl">
          {t("ready-to-elevate-your-content")}
        </h3>

        {/* Description */}
        <p className="mb-8 text-lg text-white/90">
          {t(
            "book-your-recording-session-today-and-take-advantage-of-our-professional-studio-facilities",
          )}
        </p>

        {/* Features */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-lg bg-white/10 px-4 py-7 backdrop-blur-sm"
              >
                {/* Icon */}
                <Icon className="mx-auto mb-2 h-8 w-8" />
                {/* Title */}
                <h4 className="mb-1 font-medium">{feature.title}</h4>
                {/* Description */}
                <p className="text-sm text-white/80">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Link */}
        <Link
          to={"/booking"}
          className="mt-8 inline-block cursor-pointer rounded-full border-white bg-white px-5 py-3 font-semibold text-red-600 hover:bg-red-50"
        >
          {t("book-your-session-now")}
        </Link>
      </div>
    </div>
  );
}
