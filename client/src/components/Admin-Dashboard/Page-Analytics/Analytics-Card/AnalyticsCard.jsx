import { motion } from "framer-motion";

export default function AnalyticsCard({
    path,
    totalSpent,
    visitsCount,
    averageTime,
    getPageName,
}) {
    const pageName = getPageName(path);

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours === 0) return `${remainingMinutes} minutes`;
        return `${hours} ${hours === 1 ? "hour" : "hours"
            } ${remainingMinutes} minutes`;
    };

    return (
        <motion.div
            className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-3xl p-6 hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                scale: 1.02,
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
            }}
        >
            <h2 className="text-xl font-semibold break-words text-main">
                {pageName}
            </h2>
            <div className="text-sm mt-6 space-y-4">
                <motion.div
                    className="flex items-center justify-between p-4 bg-gray-100 rounded-2xl group relative"
                    whileHover={{ scale: 1.02 }}
                >
                    <span className="font-medium text-gray-600">Total Spent</span>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ed1e26] to-[#ff4b51]">
                        {totalSpent} min
                    </span>
                    <div className="absolute hidden group-hover:block bg-white p-2 rounded-lg shadow-lg -top-12 right-0 z-10 text-sm text-gray-700 whitespace-nowrap">
                        {formatTime(totalSpent)}
                    </div>
                </motion.div>
                <motion.div
                    className="flex items-center justify-between p-4 bg-gray-100 rounded-2xl group relative"
                    whileHover={{ scale: 1.02 }}
                >
                    <span className="font-medium text-gray-600">Average Time</span>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ed1e26] to-[#ff4b51]">
                        {averageTime} min
                    </span>
                    <div className="absolute hidden group-hover:block bg-white p-2 rounded-lg shadow-lg -top-12 right-0 z-10 text-sm text-gray-700 whitespace-nowrap">
                        {formatTime(averageTime)}
                    </div>
                </motion.div>
                <motion.div
                    className="flex items-center justify-between p-4 bg-gray-100 rounded-2xl"
                    whileHover={{ scale: 1.02 }}
                >
                    <span className="font-medium text-gray-600">Visits Count</span>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ed1e26] to-[#ff4b51]">
                        {visitsCount}
                    </span>
                </motion.div>
            </div>
        </motion.div>
    );
}
