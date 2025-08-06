const navLinkClasses = ({ isActive }) =>
  `relative font-medium ${
    isActive
      ? "text-[20px] text-main font-semibold after:content-[''] after:block after:w-full after:h-[2px] after:bg-main after:absolute after:-bottom-1 after:left-0"
      : "hover:text-main/90 transition-colors duration-200"
  }`;

const PAGES_LINKS = [
  { name: "Home", path: "/" },
  { name: "Setups", path: "/setups" },
];

export { PAGES_LINKS, navLinkClasses };
