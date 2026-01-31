import { logo } from "@/assets/images";
import { LanguageSwitcher, OptimizedImage } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { Shield, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import ToggleTheme from "../../../components/common/toggle-theme";

export default function BookingHeader() {
  const { t, lng, changeLanguage } = useLocalization();

  return (
    <div className="sticky top-0 z-[500] border-b border-gray-300 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400">
      <div className="mx-auto w-full px-4 py-4 lg:max-w-6xl lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and tagline */}
          <div>
            <h1 className="text-main text-2xl font-bold md:text-3xl">
              <Link to="/">
                <OptimizedImage src={logo} alt="Goocast" className="w-36" />
              </Link>
            </h1>
            <p className="mt-1 text-sm text-gray-600 md:text-base dark:text-gray-400">
              {t("easy-podcasting-for-everyone")}
            </p>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* LanguageSwitcher visible on all screens */}
            <LanguageSwitcher lng={lng} changeLanguage={changeLanguage} />
            {/* Theme Toggle */}
            <ToggleTheme />

            {/* Trust indicators — hidden on mobile */}
            <div className="hidden items-center space-x-6 text-sm md:flex">
              <div className="flex items-center">
                <Users className="me-1 h-4 w-4" />
                <span>{t("500-sessions")}</span>
              </div>
              <div className="flex items-center">
                <Star className="me-1 h-4 w-4 text-yellow-500" />
                <span>{t("4-9-rating")}</span>
              </div>
              <div className="flex items-center">
                <Shield className="me-1 h-4 w-4 text-green-600" />
                <span>{t("secure")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
