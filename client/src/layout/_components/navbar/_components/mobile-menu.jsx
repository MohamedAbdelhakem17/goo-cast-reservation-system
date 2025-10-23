import { motion, AnimatePresence } from "framer-motion";
import { useAuthModel } from "@/context/Auth-Model-Context/AuthModelContext";
import { useAuth } from "@/context/Auth-Context/AuthContext";
import { NavLink } from "react-router-dom";
import { MobileAuthButtons } from "./auth-buttons";
import { usePublicRoutes } from "@/constants/routes";

import { navLinkClasses } from "./index";

export default function MobileMenu() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useAuthModel();
  const { isAuthenticated } = useAuth();

  const PUBLIC_ROUTES = usePublicRoutes();
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  const fadeItem = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          variants={mobileMenuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="bg-white px-5 pt-4 pb-6 shadow-lg md:hidden"
        >
          <ul className="mb-6 space-y-5">
            {PUBLIC_ROUTES.map((page, index) => (
              <motion.li
                key={index}
                variants={fadeItem}
                className="border-b border-gray-100 pb-2"
              >
                <NavLink
                  to={page.path}
                  className={navLinkClasses}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {page.name}
                </NavLink>
              </motion.li>
            ))}
          </ul>

          {!isAuthenticated && <MobileAuthButtons />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
