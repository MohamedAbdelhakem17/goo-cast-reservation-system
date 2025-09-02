import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { GetAllFaqs } from "@/apis/faq/faq"

export default function Faq() {
    const [openItem, setOpenItem] = useState(null)
    const { data: faqs, isLoading } = GetAllFaqs()

    const toggleItem = useCallback(
        (itemId) => {
            setOpenItem((prev) => (prev === itemId ? null : itemId))
        },
        []
    )

    if (isLoading) return null

    return (
        <div className="w-full mx-auto py-5">
            <h4 className="text-xl font-semibold mb-3 text-gray-900">
                Frequently Asked Questions
            </h4>

            <div className="divide-y-2 divide-gray-200">
                {faqs?.data?.map((faq) => {
                    const isOpen = openItem === faq._id

                    return (
                        <motion.div
                            key={faq._id}
                            className="bg-white overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <button
                                onClick={() => toggleItem(faq._id)}
                                className="w-full py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
                            >
                                <span
                                    className={`font-medium text-gray-900 pr-4 block ${isOpen ? "underline" : ""
                                        }`}
                                >
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-shrink-0"
                                >
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className=" pb-5 text-gray-700 leading-relaxed text-sm">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
