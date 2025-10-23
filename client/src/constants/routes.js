import { useTranslation } from "react-i18next";

export function usePublicRoutes() {
  const { t } = useTranslation();

  return [
    { name: t("home-0"), path: "/" },
    { name: t("setups-1"), path: "/setups" },
  ];
}
