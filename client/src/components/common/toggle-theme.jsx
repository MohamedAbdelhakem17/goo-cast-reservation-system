import useTheme from "@/context/theme-context/theme-context";
import THEMES from "@/utils/constant/themes.constant";

export default function ToggleTheme() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === THEMES.DARK;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? "Light mode" : "Dark mode"}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 ring-1 ring-gray-200 transition-all duration-200 hover:scale-105 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 dark:bg-gray-800 dark:ring-gray-700 dark:hover:bg-gray-700 dark:focus-visible:ring-indigo-400"
    >
      <div className="relative h-4 w-4 text-gray-700 dark:text-gray-200">
        {/* Sun */}
        <svg
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
            isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>

        {/* Moon */}
        <svg
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
            isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          />
        </svg>
      </div>
    </button>
  );
}
