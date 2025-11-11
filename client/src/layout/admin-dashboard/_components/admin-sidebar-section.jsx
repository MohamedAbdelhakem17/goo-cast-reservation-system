import { useEffect, useState } from "react";
import SidebarLink from "./sidebar-link";

const AdminSidebarSection = ({ section, location }) => {
  // State
  const [isOpen, setIsOpen] = useState(false);

  // Effect
  useEffect(() => {
    const hasActiveItem = section.items.some(
      (item) => location.pathname.includes(item.path) && item.path !== "/",
    );
    if (hasActiveItem) setIsOpen(true);
  }, [location.pathname, section.items]);

  // Function
  const toggleSection = () => setIsOpen((prev) => !prev);

  // IF  include  one item
  if (section.items.length === 1) {
    const { name, path, icon } = section.items[0];
    return <SidebarLink name={name} path={path} icon={icon} />;
  }

  return (
    <div className="mb-2">
      <button
        onClick={toggleSection}
        className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-xs font-bold uppercase transition-all duration-200 md:px-4 md:py-3 ${
          isOpen
            ? "rounded-lg bg-red-50 text-red-600"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div className="flex items-center gap-2">
          {section.icon && <section.icon className="h-4 w-4 md:h-5 md:w-5" />}
          <span>{section.name}</span>
        </div>
      </button>

      {isOpen && (
        <div className="mt-2 flex flex-col gap-1.5 rounded-lg bg-gray-50 p-2">
          {section.items.map(({ name, path, icon }) => (
            <SidebarLink key={name} name={name} path={path} icon={icon} isChild />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSidebarSection;
