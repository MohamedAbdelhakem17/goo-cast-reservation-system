
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"



export default function TabSelector({ tabs, defaultTabId }) {
    const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id)

    const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0]

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Tab Headers */}
            <div className="relative flex border-b">
                {tabs.map((tab) => {
                    const isActive = activeTabId === tab.id

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTabId(tab.id)}
                            className={`px-4 py-2 text-sm font-medium relative z-10 transition-colors duration-200 ${isActive ? "text-white" : "text-gray-500 hover:text-gray-700"
                                }`}
                            aria-selected={isActive}
                            role="tab"
                        >
                            {tab.label}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabBackground"
                                    className="absolute inset-0 rounded-t-lg bg-red-600"
                                    style={{ zIndex: -1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </button>
                    )
                })}

                {/* Animated Indicator - we'll keep this for the bottom border */}
                <AnimatePresence initial={false}>
                    {tabs.map((tab) => {
                        if (activeTabId !== tab.id) return null

                        const index = tabs.findIndex((t) => t.id === tab.id)

                        return (
                            <motion.div
                                key={tab.id}
                                className="absolute bottom-0 h-0.5 bg-red-600"
                                initial={{ left: `${index * 0}%`, right: `${100 - index * 0}%` }}
                                animate={{
                                    left: `${index * (100 / tabs.length)}%`,
                                    right: `${100 - (index + 1) * (100 / tabs.length)}%`,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                }}
                            />
                        )
                    })}
                </AnimatePresence>
            </div>

            {/* Tab Content */}
            <div className="mt-4 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTabId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="p-4"
                    >
                        {activeTab?.content}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

