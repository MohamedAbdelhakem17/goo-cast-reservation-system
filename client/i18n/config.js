import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./messages/en.json";
import ar from "./messages/ar.json";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  lng: "en",

  resources: {
    en: {
      translations: en,
    },
    ar: {
      translations: ar,
    },
  },

  ns: ["translations"],
  defaultNS: "translations",
});

export default i18n;
