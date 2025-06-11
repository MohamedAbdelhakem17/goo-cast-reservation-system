import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";

import { logo } from "../../../assets/images";

import { useAuth } from "../../../context/Auth-Context/AuthContext";
import AuthModel from "../../Navbar/Auth-Model/AuthModel";
import { AuthButtons } from "../../Navbar/Auth-Buttons/AuthButtons";
import AuthModelProvider from "../../../context/Auth-Model-Context/AuthModelContext";
import UserProfile from "../../Navbar/User-Profile/UserProfile";
import MobileToggle from "../../Navbar/Mobile-Toggle/MobileToggle";
import MobileMenu from "../../Navbar/Mobile-Menu/MobileMenu";

export default function Navbar() {
    const PAGES_LINKS = [
        { name: "Home", path: "/" },
        { name: "Setups", path: "/setups" },
    ];

    const BUTTON_ACTIONS = [];
    console.log(BUTTON_ACTIONS, "BUTTON_ACTIONS");
    console.log("rendered");

    const [scrolled, setScrolled] = useState(false);

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);



    const navLinkClasses = ({ isActive }) => `
        relative font-medium 
        ${isActive
            ? "text-[20px] text-main font-semibold after:content-[''] after:block after:w-full after:h-[2px] after:bg-main after:absolute after:-bottom-1 after:left-0"
            : "hover:text-main/90 transition-colors duration-200"
        }
    `;

    const navbarVariants = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };





    return (
        <AuthModelProvider>
            {/* Navbar */}
            <nav
                className={`w-full fixed top-0 left-0 z-50 bg-white transition-all duration-300 ${scrolled ? "shadow-lg py-2" : "shadow-md py-4"
                    }`}
            >
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
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: { delay: i * 0.1 + 0.3 },
                                }}
                            >
                                <NavLink to={page.path} className={navLinkClasses}>
                                    {page.name}
                                </NavLink>
                            </motion.li>
                        ))}
                    </ul>

                    {/* Buttons or Profile */}
                    {!isAuthenticated ? <AuthButtons /> : <UserProfile />}

                    {/* Mobile Toggle */}
                    <MobileToggle />


                </motion.div>

                {/* Mobile Menu */}
                <MobileMenu />
            </nav>

            {/* Signin & Signup Modals */}
            <AuthModel />
        </AuthModelProvider>
    );
}
