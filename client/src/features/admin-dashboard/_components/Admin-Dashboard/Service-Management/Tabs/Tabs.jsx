import { motion } from "framer-motion";

export default function ServiceTaps({ activeTab, setActiveTab }) {
    const TAPS = ["packages", "addons"];

    return (
        <div className="flex items-center space-x-1 p-2  rounded-t-xl">
            {TAPS.map((tab) => (
                <div key={tab} className="relative">
                    <button
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 
                  ${activeTab === tab
                                ? "text-white shadow-sm"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                            } focus:outline-none focus:ring-2 focus:ring-main/20`}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-gradient-to-r from-main/50 to-main/80 rounded-lg"
                                transition={{
                                    type: "spring",
                                    bounce: 0.2,
                                    duration: 0.6,
                                }}
                            />
                        )}
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {tab === "packages" ? (
                                <i className="fa-solid fa-cubes"></i>
                            ) : (
                                <i className="fa-solid fa-suitcase-rolling"></i>
                            )}

                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </span>
                    </button>
                </div>
            ))}
        </div>
    );
}
