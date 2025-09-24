import { useEffect, useState } from "react";
import { useAuth } from "@/context/Auth-Context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import Signout from "@/apis/auth/signout.api";
import useLocalization from "@/context/localization-provider/localization-context";

export default function UserProfile() {
  const { t } = useLocalization();
  const { handelLogout } = Signout();
  const { isAuthenticated, user } = useAuth();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const isAdmin = isAuthenticated && user?.role === "admin";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-menu")) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <div className="profile-menu relative">
        <motion.button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          whileTap={{ scale: 0.9 }}
          className="flex items-center space-x-2 p-1"
        >
          <i className="fa-solid fa-user-circle text-2xl"></i>
          <i className="fa-solid fa-chevron-down"></i>
        </motion.button>
        <AnimatePresence>
          {isProfileMenuOpen && (
            <motion.div
              className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ul className="py-2">
                <li>
                  <NavLink
                    to={isAdmin ? "/admin-dashboard/" : "/user-dashboard/profile"}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t("dashboard")}
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handelLogout}
                    className="block w-full px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t("logout")}
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
