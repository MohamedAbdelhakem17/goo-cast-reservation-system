import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Input from "../../../components/shared/Input/Input";
import { useToast } from "../../../context/Toaster-Context/ToasterContext";
import useGetAllStudios from "../../../apis/studios/studios.api";

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
            defaultPricePerSlot: 10000
        },
        {
            _id: "rule2",
            dayOfWeek: 6, // Saturday
            isFixedHourly: false,
            defaultPricePerSlot: 12000
        }
    ]
};

const DUMMY_PRICE_TIERS = {
    rule1: [
        {
            _id: "tier1",
            minSlots: 2,
            maxSlots: 4,
            totalPrice: 18000
        },
        {
            _id: "tier2",
            minSlots: 5,
            maxSlots: null,
            totalPrice: 40000
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
    const [priceTiers, setPriceTiers] = useState({});
    const [exceptions, setExceptions] = useState([]);

    const [newRule, setNewRule] = useState({
        dayOfWeek: "0",
        isFixedHourly: true,
        defaultPricePerSlot: 8000
    });

    const [selectedRuleId, setSelectedRuleId] = useState(null);

    const [newTier, setNewTier] = useState({
        minSlots: 2,
        maxSlots: 4,
        totalPrice: 15000
    });

    const [newException, setNewException] = useState({
        date: new Date().toISOString().split('T')[0],
        isFixedHourly: true,
        overridePricePerSlot: 10000
    });

    const loadAllPricingData = useCallback(async () => {
        setLoading(true);
        try {
            // For testing, use dummy data instead of API calls
            const studioData = DUMMY_STUDIOS.find(s => s._id === selectedStudio);
            const rules = DUMMY_PRICE_RULES[selectedStudio] || [];
            const exceptions = DUMMY_EXCEPTIONS[selectedStudio] || [];

            setStudioData(studioData);
            setPriceRules(rules);
            setExceptions(exceptions);

            // Load tiers for each rule
            const tiersData = {};
            rules.forEach(rule => {
                tiersData[rule._id] = DUMMY_PRICE_TIERS[rule._id] || [];
            });
            setPriceTiers(tiersData);
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

    const handleSaveBasePrice = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update dummy data
            const studioIndex = DUMMY_STUDIOS.findIndex(s => s._id === selectedStudio);
            if (studioIndex !== -1) {
                DUMMY_STUDIOS[studioIndex] = {
                    ...DUMMY_STUDIOS[studioIndex],
                    basePricePerSlot: studioData.basePricePerSlot,
                    isFixedHourly: studioData.isFixedHourly
                };
            }

            addToast("Base price updated successfully", "success");
        } catch (error) {
            console.error('Failed to update base price:', error);
            addToast("Failed to update base price", "error");
        }
    };

    // Enhanced functions with validation and proper cleanup
    const handleAddPriceRule = async () => {
        if (!newRule.dayOfWeek || !newRule.defaultPricePerSlot) {
            addToast("Please fill in all required fields", "error");
            return;
        }

        try {
            // Simulate API call with DUMMY_PRICE_RULES update
            await new Promise(resolve => setTimeout(resolve, 500));

            const ruleId = `rule${Date.now()}`; // Generate unique ID
            const newRuleData = {
                _id: ruleId,
                ...newRule,
                dayOfWeek: Number(newRule.dayOfWeek)
            };

            // Update dummy data
            DUMMY_PRICE_RULES[selectedStudio] = [
                ...(DUMMY_PRICE_RULES[selectedStudio] || []),
                newRuleData
            ];

            addToast("Price rule added successfully", "success");
            loadAllPricingData();

            // Reset form with new defaults
            setNewRule({
                dayOfWeek: "0",
                isFixedHourly: true,
                defaultPricePerSlot: 8000,
            });
        } catch (error) {
            console.error('Failed to add price rule:', error);
            addToast("Failed to add price rule", "error");
        }
    };

    const handleAddPriceTier = async () => {
        if (!selectedRuleId) {
            addToast("Please select a price rule first", "error");
            return;
        }

        if (newTier.maxSlots && newTier.minSlots >= newTier.maxSlots) {
            addToast("Maximum slots must be greater than minimum slots", "error");
            return;
        }

        try {
            // Simulate API call with DUMMY_PRICE_TIERS update
            await new Promise(resolve => setTimeout(resolve, 500));

            const tierId = `tier${Date.now()}`; // Generate unique ID
            const newTierData = {
                _id: tierId,
                ...newTier
            };

            // Update dummy data
            DUMMY_PRICE_TIERS[selectedRuleId] = [
                ...(DUMMY_PRICE_TIERS[selectedRuleId] || []),
                newTierData
            ].sort((a, b) => a.minSlots - b.minSlots); // Sort by minSlots

            addToast("Price tier added successfully", "success");
            loadAllPricingData();

            // Reset form with new defaults
            setNewTier({
                minSlots: 2,
                maxSlots: 4,
                totalPrice: 15000
            });
            setSelectedRuleId(null); // Close the tier form
        } catch (error) {
            console.error('Failed to add price tier:', error);
            addToast("Failed to add price tier", "error");
        }
    };

    const handleAddException = async () => {
        if (!newException.date || !newException.overridePricePerSlot) {
            addToast("Please fill in all required fields", "error");
            return;
        }

        // Validate date is not in the past
        if (new Date(newException.date) < new Date().setHours(0, 0, 0, 0)) {
            addToast("Exception date cannot be in the past", "error");
            return;
        }

        try {
            // Simulate API call with DUMMY_EXCEPTIONS update
            await new Promise(resolve => setTimeout(resolve, 500));

            const exceptionId = `exc${Date.now()}`; // Generate unique ID
            const newExceptionData = {
                _id: exceptionId,
                ...newException
            };

            // Update dummy data
            DUMMY_EXCEPTIONS[selectedStudio] = [
                ...(DUMMY_EXCEPTIONS[selectedStudio] || []),
                newExceptionData
            ].sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

            addToast("Price exception added successfully", "success");
            loadAllPricingData();

            // Reset form with new defaults
            setNewException({
                date: new Date().toISOString().split('T')[0],
                isFixedHourly: true,
                overridePricePerSlot: 10000
            });
        } catch (error) {
            console.error('Failed to add price exception:', error);
            addToast("Failed to add price exception", "error");
        }
    };

    // Add deletion handlers
    const handleDeleteRule = async (ruleId) => {
        try {
            // Update dummy data
            DUMMY_PRICE_RULES[selectedStudio] = DUMMY_PRICE_RULES[selectedStudio].filter(
                rule => rule._id !== ruleId
            );
            delete DUMMY_PRICE_TIERS[ruleId]; // Clean up associated tiers

            addToast("Price rule deleted successfully", "success");
            loadAllPricingData();
        } catch (error) {
            console.error('Failed to delete price rule:', error);
            addToast("Failed to delete price rule", "error");
        }
    };

    const handleDeleteTier = async (ruleId, tierId) => {
        try {
            // Update dummy data
            DUMMY_PRICE_TIERS[ruleId] = DUMMY_PRICE_TIERS[ruleId].filter(
                tier => tier._id !== tierId
            );

            addToast("Price tier deleted successfully", "success");
            loadAllPricingData();
        } catch (error) {
            console.error('Failed to delete price tier:', error);
            addToast("Failed to delete price tier", "error");
        }
    };

    const handleDeleteException = async (exceptionId) => {
        try {
            // Update dummy data
            DUMMY_EXCEPTIONS[selectedStudio] = DUMMY_EXCEPTIONS[selectedStudio].filter(
                exception => exception._id !== exceptionId
            );

            addToast("Price exception deleted successfully", "success");
            loadAllPricingData();
        } catch (error) {
            console.error('Failed to delete price exception:', error);
            addToast("Failed to delete price exception", "error");
        }
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
                <div className="mb-10">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Studio
                    </label>
                    <select
                        value={selectedStudio}
                        onChange={(e) => setSelectedStudio(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 transition-shadow"
                    >
                        <option value="">Select a studio...</option>
                        {DUMMY_STUDIOS.map((studio) => (
                            <option key={studio._id} value={studio._id}>
                                {studio.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedStudio && !loading && (
                    <div className="space-y-10">
                        {/* Base Price Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gray-50 p-8 rounded-xl shadow-sm"
                        >
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">
                                Base Price Settings
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <Input
                                    type="number"
                                    label="Base Price per Slot"
                                    value={studioData?.basePricePerSlot || 0}
                                    onChange={(e) => setStudioData({
                                        ...studioData,
                                        basePricePerSlot: Number(e.target.value)
                                    })}
                                    min={0}
                                />
                                <div className="flex items-center mt-8">
                                    <input
                                        type="checkbox"
                                        checked={studioData?.isFixedHourly}
                                        onChange={(e) => setStudioData({
                                            ...studioData,
                                            isFixedHourly: e.target.checked
                                        })}
                                        className="w-5 h-5 text-rose-500 rounded"
                                    />
                                    <label className="ml-3 text-gray-700">Fixed Hourly Rate</label>
                                </div>
                            </div>
                            <button
                                onClick={handleSaveBasePrice}
                                className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
                            >
                                Save Base Price
                            </button>
                        </motion.div>

                        {/* Price Rules Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gray-50 p-8 rounded-xl shadow-sm"
                        >
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">
                                Day-specific Price Rules
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <select
                                    value={newRule.dayOfWeek}
                                    onChange={(e) => setNewRule({
                                        ...newRule,
                                        dayOfWeek: e.target.value
                                    })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 transition-shadow"
                                >
                                    <option value="">Select day of week...</option>
                                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                                        <option key={day} value={day}>
                                            {getDayName(day)}
                                        </option>
                                    ))}
                                </select>
                                <Input
                                    type="number"
                                    label="Default Price per Slot"
                                    value={newRule.defaultPricePerSlot}
                                    onChange={(e) => setNewRule({
                                        ...newRule,
                                        defaultPricePerSlot: Number(e.target.value)
                                    })}
                                    min={0}
                                />
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={newRule.isFixedHourly}
                                        onChange={(e) => setNewRule({
                                            ...newRule,
                                            isFixedHourly: e.target.checked
                                        })}
                                        className="w-5 h-5 text-rose-500 rounded"
                                    />
                                    <label className="ml-3 text-gray-700">Fixed Hourly Rate</label>
                                </div>
                            </div>
                            <button
                                onClick={handleAddPriceRule}
                                className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
                            >
                                Add Price Rule
                            </button>

                            {/* Display existing rules */}
                            {priceRules.length > 0 && (
                                <div className="mt-8 space-y-6">
                                    {priceRules.map((rule) => (
                                        <motion.div
                                            key={rule._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white p-6 rounded-lg shadow-sm"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-lg font-medium text-gray-800">
                                                    {getDayName(rule.dayOfWeek)}
                                                </h4>
                                                <span className="text-rose-500 font-semibold text-lg">
                                                    ${rule.defaultPricePerSlot}/slot
                                                </span>
                                            </div>

                                            {/* Price Tiers UI */}
                                            {selectedRuleId === rule._id ? (
                                                <div className="mt-6 space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <Input
                                                            type="number"
                                                            label="Min Slots"
                                                            value={newTier.minSlots}
                                                            onChange={(e) => setNewTier({
                                                                ...newTier,
                                                                minSlots: Number(e.target.value)
                                                            })}
                                                            min={1}
                                                        />
                                                        <Input
                                                            type="number"
                                                            label="Max Slots (optional)"
                                                            value={newTier.maxSlots || ""}
                                                            onChange={(e) => setNewTier({
                                                                ...newTier,
                                                                maxSlots: e.target.value ? Number(e.target.value) : null
                                                            })}
                                                            min={newTier.minSlots}
                                                        />
                                                        <Input
                                                            type="number"
                                                            label="Total Price"
                                                            value={newTier.totalPrice}
                                                            onChange={(e) => setNewTier({
                                                                ...newTier,
                                                                totalPrice: Number(e.target.value)
                                                            })}
                                                            min={0}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={handleAddPriceTier}
                                                        className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
                                                    >
                                                        Add Tier
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setSelectedRuleId(rule._id)}
                                                    className="text-rose-500 text-sm hover:text-rose-600 font-medium"
                                                >
                                                    Add Price Tier
                                                </button>
                                            )}

                                            {/* Display existing tiers */}
                                            {priceTiers[rule._id]?.length > 0 && (
                                                <div className="mt-4 space-y-3">
                                                    {priceTiers[rule._id].map((tier) => (
                                                        <div
                                                            key={tier._id}
                                                            className="text-sm bg-gray-50 p-3 rounded-lg text-gray-700"
                                                        >
                                                            {tier.minSlots}-{tier.maxSlots || '∞'} slots:
                                                            <span className="font-semibold ml-2 text-rose-500">
                                                                ${tier.totalPrice}
                                                            </span>
                                                            <button
                                                                onClick={() => handleDeleteTier(rule._id, tier._id)}
                                                                className="ml-4 text-red-500 hover:text-red-600 text-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <button
                                                onClick={() => handleDeleteRule(rule._id)}
                                                className="mt-4 text-red-500 hover:text-red-600 text-sm"
                                            >
                                                Delete Rule
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Price Exceptions Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gray-50 p-8 rounded-xl shadow-sm"
                        >
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">
                                Special Date Exceptions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <Input
                                    type="date"
                                    label="Exception Date"
                                    value={newException.date}
                                    onChange={(e) => setNewException({
                                        ...newException,
                                        date: e.target.value
                                    })}
                                />
                                <Input
                                    type="number"
                                    label="Override Price per Slot"
                                    value={newException.overridePricePerSlot}
                                    onChange={(e) => setNewException({
                                        ...newException,
                                        overridePricePerSlot: Number(e.target.value)
                                    })}
                                    min={0}
                                />
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={newException.isFixedHourly}
                                        onChange={(e) => setNewException({
                                            ...newException,
                                            isFixedHourly: e.target.checked
                                        })}
                                        className="w-5 h-5 text-rose-500 rounded"
                                    />
                                    <label className="ml-3 text-gray-700">Fixed Hourly Rate</label>
                                </div>
                            </div>
                            <button
                                onClick={handleAddException}
                                className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
                            >
                                Add Exception
                            </button>

                            {/* Display existing exceptions */}
                            {exceptions.length > 0 && (
                                <div className="mt-8 space-y-4">
                                    {exceptions.map((exception) => (
                                        <motion.div
                                            key={exception._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center"
                                        >
                                            <div>
                                                <div className="text-lg font-medium text-gray-800">
                                                    {new Date(exception.date).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    {exception.isFixedHourly ? "Fixed Rate" : "Variable Rate"}
                                                </div>
                                            </div>
                                            <span className="text-rose-500 font-semibold text-lg">
                                                ${exception.overridePricePerSlot}/slot
                                            </span>
                                            <button
                                                onClick={() => handleDeleteException(exception._id)}
                                                className="ml-4 text-red-500 hover:text-red-600 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PriceManagement;
