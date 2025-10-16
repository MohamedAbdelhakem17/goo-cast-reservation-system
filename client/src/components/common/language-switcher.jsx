import { useState } from "react";

export default function LanguageSwitcher({ lng, changeLanguage }) {
  const [isEnglish, setIsEnglish] = useState(lng === "en");

  const toggleLanguage = () => {
    const newLang = isEnglish ? "ar" : "en";
    changeLanguage(newLang);
    setIsEnglish(!isEnglish);
  };

  return (
    <div
      onClick={toggleLanguage}
      className="relative flex h-10 w-20 cursor-pointer items-center rounded-full bg-gray-200 px-1 shadow-inner transition-all duration-300"
    >
      {/* Labels */}
      <span
        className={`font-main absolute left-2 text-sm font-semibold transition-colors ${
          isEnglish ? "text-gray-800" : "text-gray-400"
        }`}
      >
        EN
      </span>
      <span
        className={`absolute right-2 text-sm font-semibold transition-colors ${
          !isEnglish ? "text-gray-800" : "text-gray-400"
        }`}
      >
        AR
      </span>

      {/* Toggle Button */}
      <div
        className={`absolute top-1 left-1 flex h-8 w-8 transform items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ${
          isEnglish ? "translate-x-0" : "translate-x-10"
        }`}
      >
        {isEnglish ? (
          // 🇬🇧 English Flag
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 30"
            className="h-5 w-5 overflow-hidden rounded-full"
          >
            <clipPath id="s">
              <path d="M0,0 v30 h60 v-30 z" />
            </clipPath>
            <clipPath id="t">
              <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
            </clipPath>
            <g clipPath="url(#s)">
              <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
              <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
              <path
                d="M0,0 L60,30 M60,0 L0,30"
                stroke="#C8102E"
                strokeWidth="4"
                clipPath="url(#t)"
              />
              <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
              <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
            </g>
          </svg>
        ) : (
          // 🇪🇬 Egypt Flag
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 30"
            className="h-5 w-5 overflow-hidden rounded-full"
          >
            <rect width="60" height="10" y="0" fill="#ce1126" />
            <rect width="60" height="10" y="10" fill="#fff" />
            <rect width="60" height="10" y="20" fill="#000" />
            <path
              d="M30 12 L31 18 L29 18 Z"
              fill="#d4af37"
              stroke="#d4af37"
              strokeWidth="0.5"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
