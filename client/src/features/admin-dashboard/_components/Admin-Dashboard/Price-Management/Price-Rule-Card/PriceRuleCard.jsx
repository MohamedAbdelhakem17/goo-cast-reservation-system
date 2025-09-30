import { motion } from "framer-motion"
import usePriceFormat from "@/hooks/usePriceFormat"
import DiscountList from "../Discount-List/DiscountList"

const PriceRuleCard = ({ rule, onEdit  , onDelete}) => {
    const priceFormat = usePriceFormat()
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all col-span-1"
            layout
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{days[rule.dayOfWeek]}</h3>
                    <div className="flex items-center mt-1 text-gray-600">
                        <i className="fa-solid fa-calendar mr-1 text-[16px]"></i>
                        <span className="text-sm">Special pricing rule</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(rule)}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors h-8 w-8 flex items-center justify-center"
                    >
                        <i className="fa-solid fa-pen-to-square text-gray-700 text-[16px]"></i>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDelete(rule)}
                        className="p-2 bg-main/20 rounded-full hover:bg-gray-200 transition-colors h-8 w-8 flex items-center justify-center"
                    >
                        <i className="fa-solid fa-trash-can text-gray-700 text-[16px]"></i>
                    </motion.button>
                </div>
            </div>

            <div className="flex items-center mb-3 text-lg font-medium text-gray-900">
                {priceFormat(rule.defaultPricePerSlot)} per slot
            </div>

            <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex items-center mb-2">
                    <span className={`text-sm font-medium ${rule.isFixedHourly ? "text-blue-600" : "text-amber-600"}`}>
                        {rule.isFixedHourly ? "Fixed Hourly Rate" : "Flexible Pricing"}
                    </span>
                </div>

                {!rule.isFixedHourly && Object.keys(rule.perSlotDiscounts || {}).length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <i className="fa-solid fa-percent mr-1 text-[14px]"></i> Discounts
                        </h4>
                        <DiscountList discounts={rule.perSlotDiscounts || {}} isEditing={false} />
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

export default PriceRuleCard