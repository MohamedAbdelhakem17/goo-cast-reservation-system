import Addons from "@/features/admin-dashboard/_components/Admin-Dashboard/Service-Management/Add-ons/Addons";
import { motion } from "framer-motion";

export default function AddonsManagement() {
  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="p-6"
      >
        <div className="min-h-[400px] rounded-lg bg-gray-50/50 p-4">
          <Addons />
        </div>
      </motion.div>
    </div>
  );
}
