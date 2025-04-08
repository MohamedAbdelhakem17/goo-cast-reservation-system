"use client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { logo } from "../../../assets/images";

export default function Footer() {
    const NAV_LINKS = [
        { title: "Home", path: "/goocast" },
        { title: "Studios", path: "/studios" },
    ];

    const MotionLink = motion.create(Link);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
        },
    };

    // Social media links
    const socialLinks = [
        { icon: "fa-brands fa-instagram", url: "#", label: "Instagram" },
        { icon: "fa-brands fa-twitter", url: "#", label: "Twitter" },
        { icon: "fa-brands fa-facebook", url: "#", label: "Facebook" },
        { icon: "fa-brands fa-spotify", url: "#", label: "Spotify" },
    ];

    return (
        <footer className="relative bg-gradient-to-b from-main/5 to-gray-100 pt-12 pb-6 overflow-hidden w-full">
            {/* Background elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <motion.div
                    className="absolute -bottom-20 -right-20 w-80 h-80 bg-main/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                ></motion.div>
                <motion.div
                    className="absolute top-40 -left-20 w-60 h-60 bg-blue-400/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: 1,
                    }}
                ></motion.div>
            </div>

            <div className="max-w-6xl mx-auto px-6 md:px-12">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* Brand Column */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <div className="flex items-center gap-2">
                            {/* <motion.div
                                className="w-10 h-10 bg-main rounded-lg flex items-center justify-center text-white"
                                whileHover={{ rotate: 5, scale: 1.05 }}
                            >
                                <img src={footer_logo} alt="goocast" className="object-contain w-7 h-7" />
                            </motion.div>
                            <h2 className="text-2xl font-bold">Goo Cast</h2> */}

                            <Link to={"/"}>
                                <img src={logo} alt="gooCast" className="w-50" />
                            </Link>

                        </div>

                        <p className="text-gray-600 text-sm">
                            Egypt's premier podcast studio offering professional recording
                            facilities and expert guidance for podcasters.
                        </p>

                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.url}
                                    aria-label={social.label}
                                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-main hover:text-white flex items-center justify-center text-gray-600 transition-colors duration-300"
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <i className={social.icon}></i>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Navigation Links */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <h3 className="text-lg font-bold relative inline-block">
                            Navigation
                            <motion.span
                                className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-main rounded-full"
                                initial={{ width: 0 }}
                                whileInView={{ width: "50%" }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            ></motion.span>
                        </h3>

                        <ul className="space-y-3">
                            {NAV_LINKS.map((link, index) => (
                                <motion.li
                                    key={index}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Link
                                        to={link.path}
                                        className="text-gray-600 hover:text-main transition-colors duration-300 flex items-center gap-2"
                                    >
                                        <i className="fa-solid fa-chevron-right text-xs text-main/70"></i>
                                        {link.title}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>

                    </motion.div>

                    {/* Newsletter */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <h3 className="text-lg font-bold relative inline-block">
                            Stay Updated
                            <motion.span
                                className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-main rounded-full"
                                initial={{ width: 0 }}
                                whileInView={{ width: "50%" }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            ></motion.span>
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Subscribe to our newsletter for the latest updates and special
                            offers.
                        </p>
                        <form className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-main/20 focus:border-main transition-all duration-300"
                                    required
                                />
                                <motion.button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-main text-white p-2 rounded-md"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <i className="fa-solid fa-paper-plane"></i>
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>

                {/* Contact Bar */}
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 border-t border-gray-200 text-sm text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                        <a
                            href="tel:+201234567890"
                            className="flex items-center gap-2 hover:text-main transition-colors"
                        >
                            <i className="fa-solid fa-phone"></i>
                            <span>+20 123 456 7890</span>
                        </a>
                        <a
                            href="mailto:info@goocast.com"
                            className="flex items-center gap-2 hover:text-main transition-colors"
                        >
                            <i className="fa-solid fa-envelope"></i>
                            <span>info@goocast.com</span>
                        </a>
                    </div>

                    <MotionLink
                        to="/studios"
                        className="flex items-center gap-1 text-main font-medium"
                        whileHover={{ x: 5 }}
                    >
                        <span>Book a Studio</span>
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                    </MotionLink>
                </motion.div>

                {/* Copyright */}
                <motion.div
                    className="text-center pt-6 border-t border-gray-200 text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <p>© {new Date().getFullYear()} Goo Cast. All rights reserved.</p>
                </motion.div>
            </div>
        </footer>
    );
}
