import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Input from "../../../components/shared/Input/Input";
import { useToast } from "../../../context/Toaster-Context/ToasterContext";
import useGetAllStudios from "../../../apis/studios/studios.api";
import PriceRule from "../../../components/Admin-Dashboard/Price-Management/Price-Rule/PriceRule";
import SelectStudio from "../../../components/Admin-Dashboard/Price-Management/Select-Studio/SelectStudio";

// Dummy data for testing
const DUMMY_STUDIOS = [
    {
        _id: "studio1",
        name: "Urban Vision Studio",
        basePricePerSlot: 8000,
        isFixedHourly: true
    },
    {
        _id: "studio2",
        name: "Podcast Pro Studio",
        basePricePerSlot: 10000,
        isFixedHourly: false
    }
];

const DUMMY_PRICE_RULES = {
    studio1: [
        {
            _id: "rule1",
            dayOfWeek: 5, // Friday
            isFixedHourly: true,
            defaultPricePerSlot: 10000,
            perSlotDiscounts: {
                "2": 10,
                "3": 12,
                "4": 15,
                "5": 14
            }
        }
    ]
};

const DUMMY_EXCEPTIONS = {
    studio1: [
        {
            _id: "exc1",
            date: "2025-12-25",
            isFixedHourly: true,
            overridePricePerSlot: 15000
        },
        {
            _id: "exc2",
            date: "2025-12-31",
            isFixedHourly: true,
            overridePricePerSlot: 20000
        }
    ]
};

const PriceManagement = () => {
    const [selectedStudio, setSelectedStudio] = useState("");
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();
    const { data: studiosData } = useGetAllStudios();

    // Price states with improved defaults
    const [studioData, setStudioData] = useState(null);
    const [priceRules, setPriceRules] = useState([]);

    const [newRule, setNewRule] = useState({
        dayOfWeek: "0",
        isFixedHourly: true,
        defaultPricePerSlot: 8000,
        perSlotDiscounts: {},
        // New temporary state for discount input
        newSlotCount: "",
        newDiscountPercent: ""
    });

    const [newDiscount, setNewDiscount] = useState({
        slots: "",
        discountPercentage: ""
    });

    const [editingRule, setEditingRule] = useState(null);
    const [editedRule, setEditedRule] = useState(null);

    const loadAllPricingData = useCallback(async () => {
        setLoading(true);
        try {
            // For testing, use dummy data instead of API calls
            const studioData = DUMMY_STUDIOS.find(s => s._id === selectedStudio);
            const rules = DUMMY_PRICE_RULES[selectedStudio] || [];

            setStudioData(studioData);
            setPriceRules(rules);
        } catch (error) {
            console.error('Failed to load pricing data:', error);
            addToast("Failed to load pricing data", "error");
        } finally {
            setLoading(false);
        }
    }, [selectedStudio, addToast]);

    useEffect(() => {
        if (selectedStudio) {
            loadAllPricingData();
        }
    }, [selectedStudio, loadAllPricingData]); // Added loadAllPricingData to dependencies


    // Enhanced functions with validation and proper cleanup
    const handleAddPriceRule = async () => {
        if (!newRule.dayOfWeek || !newRule.defaultPricePerSlot) {
            addToast("Please fill in all required fields", "error");
            return;
        }

        try {
            const ruleId = `rule${Date.now()}`;
            const { newSlotCount, newDiscountPercent, ...ruleData } = newRule;
            const newRuleData = {
                _id: ruleId,
                ...ruleData,
                dayOfWeek: Number(newRule.dayOfWeek)
            };

            DUMMY_PRICE_RULES[selectedStudio] = [
                ...(DUMMY_PRICE_RULES[selectedStudio] || []),
                newRuleData
            ];

            addToast("Price rule added successfully", "success");
            loadAllPricingData();

            // Reset form
            setNewRule({
                dayOfWeek: "0",
                isFixedHourly: true,
                defaultPricePerSlot: 8000,
                perSlotDiscounts: {},
                newSlotCount: "",
                newDiscountPercent: ""
            });
        } catch (error) {
            console.error('Failed to add price rule:', error);
            addToast("Failed to add price rule", "error");
        }
    };

    const handleDeleteRule = async (ruleId) => {
        try {
            // Update dummy data
            DUMMY_PRICE_RULES[selectedStudio] = DUMMY_PRICE_RULES[selectedStudio].filter(
                rule => rule._id !== ruleId
            );

            addToast("Price rule deleted successfully", "success");
            loadAllPricingData();
        } catch (error) {
            console.error('Failed to delete price rule:', error);
            addToast("Failed to delete price rule", "error");
        }
    };

    const handleAddDiscount = (ruleId) => {
        if (!newDiscount.slots || !newDiscount.discountPercentage) {
            addToast("Please fill in all discount fields", "error");
            return;
        }

        const updatedRules = priceRules.map(rule => {
            if (rule._id === ruleId) {
                return {
                    ...rule,
                    perSlotDiscounts: {
                        ...rule.perSlotDiscounts,
                        [newDiscount.slots]: Number(newDiscount.discountPercentage)
                    }
                };
            }
            return rule;
        });

        DUMMY_PRICE_RULES[selectedStudio] = updatedRules;
        setPriceRules(updatedRules);
        setNewDiscount({ slots: "", discountPercentage: "" });
        addToast("Discount added successfully", "success");
    };

    const handleRemoveDiscount = (ruleId, slots) => {
        const updatedRules = priceRules.map(rule => {
            if (rule._id === ruleId) {
                const { [slots]: _, ...remainingDiscounts } = rule.perSlotDiscounts;
                return {
                    ...rule,
                    perSlotDiscounts: remainingDiscounts
                };
            }
            return rule;
        });

        DUMMY_PRICE_RULES[selectedStudio] = updatedRules;
        setPriceRules(updatedRules);
        addToast("Discount removed successfully", "success");
    };

    const handleAddDiscountToNewRule = () => {
        const { newSlotCount, newDiscountPercent } = newRule;
        if (!newSlotCount || !newDiscountPercent) {
            addToast("Please fill in both slot count and discount percentage", "error");
            return;
        }

        setNewRule(prev => ({
            ...prev,
            perSlotDiscounts: {
                ...prev.perSlotDiscounts,
                [newSlotCount]: Number(newDiscountPercent)
            },
            newSlotCount: "",
            newDiscountPercent: ""
        }));
    };

    const handleRemoveDiscountFromNewRule = (slots) => {
        setNewRule(prev => {
            const { [slots]: _, ...remainingDiscounts } = prev.perSlotDiscounts;
            return {
                ...prev,
                perSlotDiscounts: remainingDiscounts
            };
        });
    };

    const handleEditRule = (rule) => {
        setEditingRule(rule._id);
        setEditedRule({
            ...rule,
            newSlotCount: "",
            newDiscountPercent: ""
        });
    };

    const handleSaveEdit = async () => {
        try {
            // Update dummy data
            DUMMY_PRICE_RULES[selectedStudio] = DUMMY_PRICE_RULES[selectedStudio].map(rule =>
                rule._id === editingRule ? editedRule : rule
            );

            addToast("Price rule updated successfully", "success");
            setEditingRule(null);
            setEditedRule(null);
            loadAllPricingData();
        } catch (error) {
            console.error('Failed to update price rule:', error);
            addToast("Failed to update price rule", "error");
        }
    };

    const handleCancelEdit = () => {
        setEditingRule(null);
        setEditedRule(null);
    };

    const handleEditedRuleChange = (field, value) => {
        setEditedRule(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddDiscountToEditedRule = () => {
        if (!editedRule.newSlotCount || !editedRule.newDiscountPercent) {
            addToast("Please fill in both slot count and discount percentage", "error");
            return;
        }

        setEditedRule(prev => ({
            ...prev,
            perSlotDiscounts: {
                ...prev.perSlotDiscounts,
                [prev.newSlotCount]: Number(prev.newDiscountPercent)
            },
            newSlotCount: "",
            newDiscountPercent: ""
        }));
    };

    const handleRemoveDiscountFromEditedRule = (slots) => {
        setEditedRule(prev => {
            const { [slots]: _, ...remainingDiscounts } = prev.perSlotDiscounts;
            return {
                ...prev,
                perSlotDiscounts: remainingDiscounts
            };
        });
    };

    const getDayName = (day) => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[day];
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-8"
            >
                <h2 className="text-3xl font-bold mb-8 text-gray-800">
                    Studio Price Management
                </h2>

                {/* Studio Selection */}
                <SelectStudio selectedStudio={selectedStudio} setSelectedStudio={setSelectedStudio} DUMMY_STUDIOS={DUMMY_STUDIOS} />

                {/* Studio Price Rules */}
                {selectedStudio && !loading && (<PriceRule selectedStudio={selectedStudio} addToast={addToast} DUMMY_PRICE_RULES={DUMMY_PRICE_RULES} />)}

            </motion.div>
        </div>
    );
};

export default PriceManagement;
