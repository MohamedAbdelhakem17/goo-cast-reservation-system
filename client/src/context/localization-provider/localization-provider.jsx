import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LocalesContext } from "./localization-context";
import i18n from "../../../i18n/config";

export const LocalizationProvider = ({ children }) => {
  const { t } = useTranslation();
  const [lng, setLng] = useState(localStorage.getItem("language") || "en");

  const changeLanguage = async (newLng) => {
    setLng(newLng);
    localStorage.setItem("language", newLng);

    document.documentElement.setAttribute("dir", newLng === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", newLng);
    document.body.setAttribute("class", newLng === "ar" ? "font-arabic" : "font-main");

    await i18n.changeLanguage(newLng);
  };

  useEffect(() => {
    changeLanguage(lng);
  }, []);

  return (
    <LocalesContext.Provider value={{ t, changeLanguage, lng }}>
      {children}
    </LocalesContext.Provider>
  );
};
