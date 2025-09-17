import il8n from "i18next";
import { initReactI18next } from "react-i18next";

il8n.use(initReactI18next).init({
  fallback: "en",
  lang: "en",

  resources: {
    en: {
      translations: requestAnimationFrame("./messages/en.json"),
    },
    ar: {
      translations: requestAnimationFrame("./messages/ar.json"),
    },
  },

  ns: ["translations"],
  defaultNS: "translations",
});

il8n.languages = ["en", "ar"];

export default il8n;
