import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import AnalyticsCard from "@/components/Admin-Dashboard/Page-Analytics/Analytics-Card/AnalyticsCard";
import Chart from "@/components/Admin-Dashboard/Page-Analytics/Chart/Chart";
import { GetPageAnalytics } from "@/apis/analytics/analytics.api";

const getPageName = (path) => {
  if (path === "/") return "Home";
  if (path === "/studios") return "Studios";
  if (path.startsWith("/booking")) {
    const params = new URLSearchParams(path.split("?")[1]);
    const step = params.get("step");
    switch (step) {
      case "select-studio":
        return "Select Studio Step";
      case "select-date-":
        return "Select Date step";
      case "select-additional-services":
        return "Additional Services Step";
      case "personal-information":
        return "Personal Info Step";
      default:
        return "Booking";
    }
  }
  return path;
};


export default function PageAnalytics() {
  const { data: analytics, loading } = GetPageAnalytics()

  const chartData = analytics?.map((item) => ({
    name: getPageName(item._id),
    visits: item.visitsCount,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 "
    >
      <motion.h1
        className="text-4xl font-bold mb-12 text-main flex items-center gap-3"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <span>📊</span> Analytics Overview
      </motion.h1>

      {loading ? (
        <motion.div
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ed1e26]"></div>
        </motion.div>
      ) : (
        <AnimatePresence>

          <Chart chartData={chartData} />
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {analytics?.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AnalyticsCard
                  getPageName={getPageName}
                  key={item._id}
                  path={item._id}
                  totalSpent={item.totalSpent}
                  visitsCount={item.visitsCount}
                  averageTime={item.averageTime}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
