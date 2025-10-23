import { motion } from "framer-motion";
import { Loading } from "@/components/common";
import { StudioCard } from "./_components";
import useLocalization from "@/context/localization-provider/localization-context";
import { useGetStudio } from "@/apis/public/studio.api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export default function Studios() {
  // Localization
  const { t } = useLocalization();

  // Query
  const { data: studiosData, isLoading } = useGetStudio(true);

  // Loading State
  if (isLoading) return <Loading />;

  return (
    <main className="container mx-auto my-5 p-5">
      <div className="mx-auto max-w-6xl">
        {/* Title */}
        <motion.h2
          className="my-10 text-center text-3xl font-bold text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("find-your-perfect-setup")}
        </motion.h2>

        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Display Studio */}
          {studiosData?.data?.map((studio) => (
            <StudioCard studio={studio} key={studio._id} />
          ))}
        </motion.div>
      </div>
    </main>
  );
}
