import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n/config";
import { LocalesContext } from "./localization-context";

export const LocalizationProvider = ({ children }) => {
  const { t } = useTranslation();
  const [lng, setLng] = useState(localStorage.getItem("language") || "en");

  const changeLanguage = async (newLng) => {
    setLng(newLng);
    localStorage.setItem("language", newLng);

    document.documentElement.setAttribute("dir", newLng === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", newLng);

    // Remove both font classes and add the appropriate one
    document.body.classList.remove("font-arabic", "font-main");
    document.body.classList.add(newLng === "ar" ? "font-arabic" : "font-main");

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
