import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { logo } from "../../../assets/images";
import Signin from "../../../pages/Signin/Signin";
import Signup from "../../../pages/Signup/Signup";
import { useAuth } from "../../../context/Auth-Context/AuthContext";
import Signout from "../../../apis/auth/signout.api";

export default function Navbar() {
    const PAGES_LINKS = [
        { name: "Home", path: "/" },
        { name: "Setups", path: "/setups" },
    ];

    const BUTTON_ACTIONS = [
        { name: "Login", action: () => setIsSigninOpen(prev => !prev) },
        { name: "Sign Up", action: () => setIsSignupOpen(prev => !prev) },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isSigninOpen, setIsSigninOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const { handelLogout } = Signout();
    const isAdmin = isAuthenticated && user?.role === "admin";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".profile-menu")) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const navLinkClasses = ({ isActive }) => `
        relative font-medium 
        ${isActive
            ? "text-[20px] text-main font-semibold after:content-[''] after:block after:w-full after:h-[2px] after:bg-main after:absolute after:-bottom-1 after:left-0"
            : "hover:text-main/90 transition-colors duration-200"}
    `;

    const navbarVariants = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const mobileMenuVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "auto" }
    };

    const fadeItem = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    const buttonVariants = {
        hover: { scale: 1.05, boxShadow: "0 4px 10px rgba(237,30,38,0.3)" },
        tap: { scale: 0.95, boxShadow: "0 2px 5px rgba(237,30,38,0.2)" }
    };

    return (
        <>
            {/* Navbar */}
            <nav className={`w-full fixed top-0 left-0 z-50 bg-white transition-all duration-300 ${scrolled ? "shadow-lg py-2" : "shadow-md py-4"}`}>
                <motion.div
                    variants={navbarVariants}
                    initial="initial"
                    animate="animate"
                    className="container mx-auto px-5 flex justify-between items-center"
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <motion.img
                            src={logo}
                            alt="Logo"
                            className="w-36"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex items-center space-x-8">
                        {PAGES_LINKS.map((page, i) => (
                            <motion.li key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 + 0.3 } }}>
                                <NavLink to={page.path} className={navLinkClasses}>{page.name}</NavLink>
                            </motion.li>
                        ))}
                    </ul>

                    {/* Buttons or Profile */}
                    {!isAuthenticated ? (
                        <div className="hidden md:flex items-center space-x-4">
                            {BUTTON_ACTIONS.map((btn, i) => (
                                <motion.button
                                    key={i}
                                    onClick={btn.action}
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    className={`${i === 0 ? "bg-white text-main/90 border border-main/50 hover:bg-blue-50" : "bg-main/90 text-white hover:bg-main"} px-5 py-2 rounded-md font-medium`}
                                >
                                    {btn.name}
                                </motion.button>
                            ))}
                        </div>
                    ) : (
                        <div className="relative profile-menu">
                            <motion.button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} whileTap={{ scale: 0.9 }} className="p-1 flex items-center space-x-2">
                                <i className="fa-solid fa-user-circle text-2xl"></i>
                                <i className="fa-solid fa-chevron-down"></i>
                            </motion.button>
                            <AnimatePresence>
                                {isProfileMenuOpen && (
                                    <motion.div
                                        className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <ul className="py-2">
                                            <li>
                                                <NavLink to={isAdmin ? "/admin-dashboard/welcome" : "/user-dashboard/profile"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Dashboard
                                                </NavLink>
                                            </li>
                                            <li>
                                                <button onClick={handelLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <motion.div className="md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
                        <motion.button
                            onClick={() => setIsMobileMenuOpen(prev => !prev)}
                            whileTap={{ scale: 0.9 }}
                            className="p-1"
                        >
                            <AnimatePresence mode="wait">
                                {isMobileMenuOpen ? (
                                    <motion.i key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="fa-solid fa-xmark text-2xl" />
                                ) : (
                                    <motion.i key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="fa-solid fa-bars text-2xl" />
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Mobile Menu */}
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
                                    <motion.li key={index} variants={fadeItem} className="border-b border-gray-100 pb-2">
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

                            {!isAuthenticated && (
                                <div className="space-y-3">
                                    {BUTTON_ACTIONS.map((button, i) => (
                                        <motion.button
                                            key={i}
                                            variants={fadeItem}
                                            whileHover="hover"
                                            whileTap="tap"
                                            className={`${i === 0 ? "bg-white text-main/90 border border-main/50 hover:bg-blue-50" : "bg-main/90 text-white hover:bg-main"} px-5 py-2 rounded-md font-medium w-full`}
                                            onClick={() => {
                                                button.action();
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            {button.name}
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Signin & Signup Modals */}
            <AnimatePresence mode="wait">
                {(isSignupOpen || isSigninOpen) && (
                    <motion.div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {isSignupOpen && (
                            <Signup
                                closeModal={() => setIsSignupOpen(false)}
                                changeForm={() => {
                                    setIsSignupOpen(false);
                                    setIsSigninOpen(true);
                                }}
                            />
                        )}
                        {isSigninOpen && (
                            <Signin
                                closeModal={() => setIsSigninOpen(false)}
                                changeForm={() => {
                                    setIsSigninOpen(false);
                                    setIsSignupOpen(true);
                                }}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
