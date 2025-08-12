import { motion } from "framer-motion";
import useGetAllStudios from "@/apis/studios/studios.api";
import { Loading } from "@/components/common";
import { StudioCard } from "./_components";

export default function Studios() {
  const { data: studiosData, isLoading } = useGetAllStudios();
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

  if (isLoading) return <Loading />;

  return (
    <main className="container mx-auto p-5 my-5">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl font-bold text-center my-10 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Find Your Perfect Setup
        </motion.h2>

        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {studiosData?.data?.map((studio) => (
            <StudioCard studio={studio} />
          ))}
        </motion.div>
      </div>
    </main>
  );
}
