const navLinkClasses = ({ isActive }) =>
  `relative font-medium text-gray-900 dark:text-gray-100 ${
    isActive
      ? "text-[20px] text-main font-semibold after:content-[''] after:block after:w-full after:h-[2px] after:bg-main after:absolute after:-bottom-1 after:left-0"
      : "hover:text-main/90 transition-colors duration-200"
  }`;

export default navLinkClasses;
