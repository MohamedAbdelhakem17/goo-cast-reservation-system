import { Facebook, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { footerBg, logo } from "@/assets/images";
import useLocalization from "@/context/localization-provider/localization-context";
import { OptimizedImage } from "@/components/common";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useNewsLetterSubscribe } from "@/apis/public/subscribe.api";
import { useFormik } from "formik";

export function BookingFooter() {
  const { t } = useLocalization();
  const { subscribe, isPending } = useNewsLetterSubscribe();
  const { addToast } = useToast();

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: { email: "" },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = t("email-is-required");
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = t("invalid-email-address");
      }
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        await subscribe(values, {
          onSuccess: (res) => {
            addToast(res?.message || "Subscribed successfully!", "success");
            resetForm();
          },
          onError: (err) => {
            addToast(err?.response?.data?.message || "Subscription failed", "error");
          },
        });
      } catch (err) {
        addToast("Something went wrong", "error");
      }
    },
  });

  return (
    <footer className="relative mt-6 overflow-hidden bg-[#1a1a1a] px-6 pt-16 pb-8 text-white">
      {/* Background Image */}
      <img
        src={footerBg}
        alt="goocast"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
      />

      {/* ✅ Main Content */}
      <div className="relative container mx-auto">
        {/* 🔸 Newsletter Section */}
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-5xl font-bold"
          >
            {t("join-the")} <span className="text-color">{t("growing-community")}</span>
            <br />
            {t("of-goocast")}
          </motion.h2>

          <p className="my-6 text-lg text-white/80">
            {t("stay-up-to-date-with-industry-insights-and-community-events")}
          </p>

          {/* Form */}
          <form
            onSubmit={formik.handleSubmit}
            className="mx-auto flex max-w-md flex-col items-center gap-3"
          >
            <input
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder={t("enter-your-email")}
              className={`w-80 flex-1 rounded-full border bg-white px-3 py-2 text-black placeholder-gray-700 focus:ring-2 focus:outline-none ${
                formik.errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-600 focus:ring-red-500"
              }`}
            />
            {formik.errors.email && (
              <p className="text-sm text-red-400">{formik.errors.email}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded-full bg-red-600 px-8 py-2 font-semibold text-white transition-all hover:scale-105 hover:bg-red-700 disabled:opacity-60"
            >
              {isPending ? t("subscribing") : t("subscribe-now")}
            </button>
          </form>
        </div>

        {/* 🔸 Footer Links */}
        <div className="grid grid-cols-1 items-start gap-8 py-4 pt-12 md:grid-cols-3">
          {/* Left - Brand */}
          <div>
            <OptimizedImage src={logo} alt="Logo" className="w-40" />
            <p className="mt-2 text-sm text-gray-400">{t("home-of-content-creators")}</p>
          </div>

          {/* Center - Social */}
          <div className="text-center">
            <p className="mb-4 text-sm text-gray-400">{t("find-us-at")}</p>
            <div className="flex justify-center gap-4">
              {[
                { Icon: Facebook, link: "https://www.facebook.com/goocaststudios" },
                { Icon: Instagram, link: "https://www.instagram.com/goocaststudios/" },
                { Icon: Linkedin, link: "https://eg.linkedin.com/company/goocast" },
              ].map(({ Icon, link }, i) => (
                <motion.a
                  key={i}
                  href={link}
                  target="_blank"
                  whileHover={{ scale: 1.1 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  aria-label={Icon.name}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right - Policies */}
          <div className="flex flex-col items-center justify-center gap-2 md:items-end">
            <a
              href="#"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {t("privacy-policy")}
            </a>
            <a
              href="#"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {t("terms-and-conditions")}
            </a>
          </div>
        </div>

        {/* 🔸 Copyright */}
        <motion.div
          className="mt-5 text-center text-sm text-gray-500"
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
