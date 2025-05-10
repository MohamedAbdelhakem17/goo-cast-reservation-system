import { useState } from "react"
import { motion } from "framer-motion"
import Input from "../../../shared/Input/Input"
import DiscountList from "../Discount-List/DiscountList"

const EditRuleForm = ({ rule, onSave, onCancel }) => {
    const [editedRule, setEditedRule] = useState({
        ...rule,
    })

    const handleChange = (field, value) => {
        setEditedRule((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleAddDiscount = () => {
        if (editedRule.newSlotCount && editedRule.newDiscountPercent) {
            setEditedRule((prev) => ({
                ...prev,
                perSlotDiscounts: {
                    ...prev.perSlotDiscounts,
                    [prev.newSlotCount]: prev.newDiscountPercent,
                },
            }))
        }
    }

    const handleRemoveDiscount = (slot) => {
        const updatedDiscounts = { ...editedRule.perSlotDiscounts }
        delete updatedDiscounts[slot]

        setEditedRule((prev) => ({
            ...prev,
            perSlotDiscounts: updatedDiscounts,
        }))
    }

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-white to-rose-50 rounded-xl shadow-md p-6 border border-rose-100 col-span-1"
            layout
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Edit Rule for {days[rule.dayOfWeek]}</h3>
                <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCancel}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <i className="fa-solid fa-xmark text-gray-700 text-[16px]"></i>
                </motion.button>
            </div>

            <div>
                <div className="grid grid-cols-1 ">
                    <Input
                        type="number"
                        label="Default Price per Slot"
                        value={editedRule.defaultPricePerSlot}
                        onChange={(e) => handleChange("defaultPricePerSlot", Number(e.target.value))}
                        placeholder="Enter default price per slot"
                    />

                    <div className="flex items-center space-x-3 mb-3">
                        <input
                            type="checkbox"
                            id="isFixedHourly"
                            checked={editedRule.isFixedHourly}
                            onChange={(e) => handleChange("isFixedHourly", e.target.checked)}
                            className="w-5 h-5 text-rose-500 rounded"
                        />
                        <label htmlFor="isFixedHourly" className="text-gray-700">
                            Fixed Hourly Rate
                        </label>
                    </div>
                </div>

                {!editedRule.isFixedHourly && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-5 rounded-lg shadow-sm"
                    >
                        <h4 className="text-md font-medium text-gray-800 mb-4">Manage Discounts</h4>

                        <div className="grid grid-cols-1  gap-4 mb-4">
                            <Input
                                type="number"
                                label="Number of Slots"
                                value={editedRule.newSlotCount}
                                onChange={(e) => handleChange("newSlotCount", Number(e.target.value))}
                                min={1}
                                placeholder="Enter number of slots"
                            />
                            <Input
                                type="number"
                                label="Discount Percentage"
                                value={editedRule.newDiscountPercent}
                                onChange={(e) => handleChange("newDiscountPercent", Number(e.target.value))}
                                min={0}
                                max={100}
                                placeholder="Enter discount percentage"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleAddDiscount}
                            className="flex items-center px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors text-sm"
                        >
                            <i className="fa-solid fa-plus mr-1 text-[16px]"></i> Add Discount
                        </motion.button>

                        <DiscountList
                            discounts={editedRule.perSlotDiscounts || {}}
                            isEditing={true}
                            onDelete={handleRemoveDiscount}
                        />
                    </motion.div>
                )}

                <div className="flex space-x-3 mt-6">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onSave(editedRule)}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-colors shadow-sm flex items-center justify-center"
                    >
                        <i className="fa-solid fa-floppy-disk mr-2 text-[18px]"></i>Save Changes
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onCancel}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default EditRuleForm