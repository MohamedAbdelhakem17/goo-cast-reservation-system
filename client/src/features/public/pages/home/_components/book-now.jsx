import React from "react";
import { Calendar, Clock, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import useLocalization from "@/context/localization-provider/localization-context";
export default function BookNow() {
  const { t } = useLocalization();
  return (
    <div className="from-main to-main/70 my-12 rounded-xl bg-gradient-to-r p-12 text-white">
      <div className="mx-auto max-w-[90%] text-center">
        <h3 className="mb-4 text-2xl font-bold md:text-3xl">
          {t("ready-to-elevate-your-content")}
        </h3>
        <p className="mb-8 text-lg text-white/90">
          {t(
            "book-your-recording-session-today-and-take-advantage-of-our-professional-studio-facilities",
          )}
        </p>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white/10 px-4 py-7 backdrop-blur-sm">
            <Calendar className="mx-auto mb-2 h-8 w-8" />
            <h4 className="mb-1 font-medium">{t("flexible-scheduling")}</h4>
            <p className="text-sm text-white/80">
              {t("book-your-preferred-date-and-time")}
            </p>
          </div>

          <div className="rounded-lg bg-white/10 px-4 py-7 backdrop-blur-sm">
            <Mic className="mx-auto mb-2 h-8 w-8" />
            <h4 className="mb-1 font-medium">{t("professional-equipment")}</h4>
            <p className="text-sm text-white/80">
              {t("high-quality-audio-and-video-gear")}
            </p>
          </div>

          <div className="rounded-lg bg-white/10 px-4 py-7 backdrop-blur-sm">
            <Clock className="mx-auto mb-2 h-8 w-8" />
            <h4 className="mb-1 font-medium">{t("quick-turnaround")}</h4>
            <p className="text-sm text-white/80">
              {t("get-your-content-ready-to-publish-fast")}
            </p>
          </div>
        </div>

        <Link
          to={"/booking"}
          className="mt-8 inline-block cursor-pointer rounded-full border-white bg-white px-8 py-3 font-semibold text-red-600 hover:bg-red-50"
        >
          {t("book-your-session-now")}
        </Link>
      </div>
    </div>
  );
}
