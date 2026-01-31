"use client";
import { logo } from "@/assets/images";
import useLocalization from "@/context/localization-provider/localization-context";
import useQuickBooking from "@/hooks/useQuickBooking";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useLocalization();
  const NAV_LINKS = [
    { title: t("home"), path: "/" },
    { title: t("setups-0"), path: "/setups" },
  ];

  const { handleQuickBooking } = useQuickBooking();

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
    {
      icon: "fa-brands fa-instagram",
      url: "https://www.instagram.com/dottopia_agency/",
      label: t("instagram"),
    },
    {
      icon: "fa-brands fa-facebook",
      url: "https://www.facebook.com/Dottopia/",
      label: t("facebook"),
    },
    {
      icon: "fa-brands fa-tiktok",
      url: "https://www.tiktok.com/@dottopia_agency",
      label: t("tiktok"),
    },
    {
      icon: "fa-brands fa-linkedin",
      url: "https://www.linkedin.com/company/dottopia/",
      label: t("linkedin"),
    },
  ];

  return (
    <footer className="from-main/5 relative w-full overflow-hidden bg-gradient-to-b to-gray-100 pt-12 pb-6 transition-colors duration-300 dark:from-gray-900 dark:to-gray-950">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="bg-main/5 absolute -right-20 -bottom-20 h-80 w-80 rounded-full blur-3xl"
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
          className="absolute top-40 -left-20 h-60 w-60 rounded-full bg-blue-400/5 blur-3xl"
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

      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.div
          className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-3"
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

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t(
                "egypts-premier-podcast-studio-offering-professional-recording-facilities-and-expert-guidance-for-podcasters",
              )}
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  aria-label={social.label}
                  className="hover:bg-main flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors duration-300 hover:text-white dark:bg-gray-800 dark:text-gray-400"
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
            <h3 className="relative inline-block text-lg font-bold text-gray-900 dark:text-gray-100">
              {t("navigation")}
              <motion.span
                className="bg-main absolute -bottom-1 left-0 h-0.5 w-1/2 rounded-full"
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
                    className="hover:text-main flex items-center gap-2 text-gray-600 transition-colors duration-300 dark:text-gray-400"
                  >
                    <i className="fa-solid fa-chevron-right text-main/70 text-xs"></i>
                    {link.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="relative inline-block text-lg font-bold text-gray-900 dark:text-gray-100">
              {t("stay-updated")}
              <motion.span
                className="bg-main absolute -bottom-1 left-0 h-0.5 w-1/2 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "50%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              ></motion.span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("subscribe-to-our-newsletter-for-the-latest-updates-and-special-offers")}
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder={t("your-email-address")}
                  className="focus:ring-main/20 focus:border-main w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  required
                />
                <motion.button
                  type="submit"
                  className="bg-main absolute end-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-white"
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
          className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 py-6 text-sm text-gray-600 md:flex-row dark:border-gray-800 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:gap-8">
            <a
              href="tel:+201234567890"
              className="hover:text-main flex items-center gap-2 transition-colors"
            >
              <i className="fa-solid fa-phone"></i>
              <span>01010955331</span>
            </a>
            <a
              href="mailto:info@goocast.com"
              className="hover:text-main flex items-center gap-2 transition-colors"
            >
              <i className="fa-solid fa-envelope"></i>
              <span>studio@goocast.net</span>
            </a>
          </div>

          <motion.button
            onClick={() => handleQuickBooking(1)}
            className="text-main flex cursor-pointer items-center gap-1 font-medium"
            whileHover={{ x: 5 }}
          >
            <span>{t("book-a-studio")}</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </motion.button>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="border-t border-gray-200 pt-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p>
            © {new Date().getFullYear()} {t("goo-cast-all-rights-reserved")}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
