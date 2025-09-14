import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { logo } from "@/assets/images";
import AuthModelProvider from "@/context/Auth-Model-Context/AuthModelContext";
import { useAuth } from "@/context/Auth-Context/AuthContext";

import {
  AuthButtons,
  AuthModel,
  MobileToggle,
  MobileMenu,
  UserProfile,
} from "./_components";
import { PUBLIC_ROUTES } from "@/constants/routes";
import navLinkClasses from "./_assets/nav-link-classes";
import { OptimizedImage } from "@/components/common";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <AuthModelProvider>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 z-50 w-full bg-white transition-all duration-300 ${
          scrolled ? "py-2 shadow-lg" : "py-4 shadow-md"
        }`}
      >
        <motion.div
          variants={navbarVariants}
          initial="initial"
          animate="animate"
          className="container mx-auto flex items-center justify-between px-5"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <OptimizedImage
              src={logo}
              alt="Logo"
              className="w-36"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400 }}
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden items-center space-x-8 md:flex">
            {PUBLIC_ROUTES.map((page, i) => (
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
