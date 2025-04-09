import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { logo } from "../../../assets/images";
import Signin from "../../../pages/Signin/Signin";
import Signup from "../../../pages/Signup/Signup";

export default function Navbar() {
    // Constants
    const PAGES_LINKS = [
        { name: "Home", path: "/" },
        { name: "Studios", path: "/studios" },
    ];

    const BUTTON_ACTIONS = [
        { name: "Login", action: () => setIsSigninOpen(prev => !prev) },
        { name: "Sign Up", action: () => setIsSignupOpen(prev => !prev) },
    ];

    // States
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false)
    const [isSigninOpen, setIsSigninOpen] = useState(false)

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    // NavLink class function for active link styling
    const navLinkClasses = ({ isActive }) => {
        return `relative font-medium ${isActive
            ? "text-[20px] text-main font-semibold after:content-[''] after:block after:w-full after:h-[2px] after:bg-main after:absolute after:-bottom-1 after:left-0 after:transition-all after:duration-300"
            : "hover:text-main/90 transition-colors duration-200"
            }`;
    };

    // Define animation variants
    const navbarVariants = {
        initial: { opacity: 0, y: -20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const mobileMenuVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: [0.33, 1, 0.68, 1],
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    const fadeItem = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            boxShadow: "0 4px 10px rgba(237, 30, 38, 0.3)",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
            },
        },
        tap: {
            scale: 0.95,
            boxShadow: "0 2px 5px rgba(237, 30, 38, 0.2)",
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 15,
            },
        },
    };

    return (
        <>
            {/* Navbar */}
            <nav className={`w-full fixed top-0 left-0 z-50 bg-white transition-all duration-300 ${scrolled ? "shadow-lg py-2" : "shadow-md py-4"}`} >
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
                            alt="Goo Cast"
                            className="w-36"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex items-center space-x-8">
                        {PAGES_LINKS.map((page, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        delay: index * 0.1 + 0.3,
                                        duration: 0.5,
                                        ease: [0.22, 1, 0.36, 1],
                                    },
                                }}
                            >
                                <NavLink to={page.path} className={navLinkClasses}>
                                    {page.name}
                                </NavLink>
                            </motion.li>
                        ))}
                    </ul>

                    <div className="hidden md:flex items-center space-x-4">
                        {BUTTON_ACTIONS.map((button, index) => (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: {
                                        delay: index * 0.1 + 0.5,
                                        duration: 0.5,
                                        ease: [0.22, 1, 0.36, 1],
                                    },
                                }}
                                whileHover="hover"
                                whileTap="tap"
                                variants={buttonVariants}
                                className={`${index === 0
                                    ? "bg-white text-main/90 border border-main/50"
                                    : "bg-main/90 text-white"
                                    } px-5 py-2 rounded-md font-medium transition-colors duration-200 ${index === 0 ? "hover:bg-blue-50" : "hover:bg-main"
                                    }`}
                                onClick={button.action}
                            >
                                {button.name}
                            </motion.button>
                        ))}
                    </div>

                    {/* Mobile Toggle */}
                    <motion.div
                        className="md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.3 } }}
                    >
                        <motion.button
                            onClick={() => setMenuOpen(!menuOpen)}
                            whileTap={{ scale: 0.9 }}
                            className="p-1"
                        >
                            <AnimatePresence mode="wait">
                                {menuOpen ? (
                                    <motion.i
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="fa-solid fa-xmark text-2xl"
                                    ></motion.i>
                                ) : (
                                    <motion.i
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="fa-solid fa-bars text-2xl"
                                    ></motion.i>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            variants={mobileMenuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="md:hidden bg-white shadow-lg px-5 pt-4 pb-6 overflow-hidden"
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
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            {page.name}
                                        </NavLink>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* Button Actions */}
                            <div className="space-y-3">
                                {BUTTON_ACTIONS.map((button, index) => (
                                    <motion.button
                                        key={index}
                                        variants={fadeItem}
                                        whileHover="hover"
                                        whileTap="tap"
                                        className={`${index === 0
                                            ? "bg-white text-main/90 border border-main/50"
                                            : "bg-main/90 text-white"
                                            } px-5 py-2 rounded-md font-medium transition-colors duration-200  w-full ${index === 0 ? "hover:bg-blue-50" : "hover:bg-main"
                                            }`}
                                        onClick={() => {
                                            button.action();
                                            setMenuOpen(false);
                                        }}
                                    >
                                        {button.name}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Signup & Signin Modal */}
            <AnimatePresence mode="wait">
                {
                    (isSignupOpen || isSigninOpen) &&
                    <motion.div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                        {isSignupOpen &&
                            <Signup
                                closeModal={() => setIsSignupOpen(false)}
                                changeForm={() => {
                                    setIsSignupOpen(false);
                                    setIsSigninOpen(true);
                                }}
                            />}
                        {isSigninOpen &&
                            <Signin
                                closeModal={() => setIsSigninOpen(false)}
                                changeForm={() => {
                                    setIsSigninOpen(false);
                                    setIsSignupOpen(true);
                                }}
                            />}
                    </motion.div>
                }
            </AnimatePresence>

        </>
    );
}
