import { motion, AnimatePresence } from "framer-motion";
import { useAuthModel } from "../../../context/Auth-Model-Context/AuthModelContext";
import { useAuth } from "../../../context/Auth-Context/AuthContext";
import { NavLink } from "react-router-dom";
import { MobileAuthButtons } from "../Auth-Buttons/AuthButtons";
import { navLinkClasses, PAGES_LINKS } from "../Navbar.assets";

export default function MobileMenu() {
    const { isMobileMenuOpen, setIsMobileMenuOpen } = useAuthModel()
    const { isAuthenticated } = useAuth()


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
                    className="md:hidden bg-white shadow-lg px-5 pt-4 pb-6"
                >
                    <ul className="space-y-5 mb-6">
                        {PAGES_LINKS.map((page, index) => (
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
    )
}
