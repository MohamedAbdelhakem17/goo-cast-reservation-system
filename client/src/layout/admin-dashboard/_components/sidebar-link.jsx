import { NavLink } from "react-router-dom";

const SidebarLink = ({ name, path, icon: Icon, isChild = false }) => {
  return (
    <NavLink
      end={path === "/admin-dashboard"}
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 md:px-4 ${isChild ? "ml-3" : ""} ${
          isActive
            ? "border-s-4 border-red-600 bg-white font-bold text-red-600 shadow-sm"
            : "font-medium text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
        } `
      }
    >
      <Icon className="h-4 w-4 flex-shrink-0 md:h-5 md:w-5" />
      <span className="truncate text-xs md:text-sm">{name}</span>
    </NavLink>
  );
};

export default SidebarLink;
