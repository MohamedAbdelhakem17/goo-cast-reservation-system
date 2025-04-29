import React, { useReducer, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Input from "../../../shared/Input/Input";
import { AddPriceRule, DeletePriceRule, GetPriceRules, UpdatedPriceRules } from "../../../../apis/price/price.api";
import Loading from "../../../shared/Loading/Loading";
import usePriceFormat from "../../../../hooks/usePriceFormat";
import { useToast } from "../../../../context/Toaster-Context/ToasterContext";
import Popup from "../../../shared/Popup/Popup";
import { produce } from "immer";
import SelectInput from "../../../shared/Select-Input/SelectInput";

const initialState = {
    newRule: {
        dayOfWeek: "",
        isFixedHourly: false,
        defaultPricePerSlot: "",
        perSlotDiscounts: {},
        newSlotCount: "",
        newDiscountPercent: "",
    },
    editingRuleId: null,
    editedRule: null,
};

function reducer(state, action) {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SET_NEW_RULE_FIELD":
                draft.newRule[action.field] = action.value;
                break;
            case "ADD_DISCOUNT_TO_NEW_RULE":
                draft.newRule.perSlotDiscounts[draft.newRule.newSlotCount] = Number(draft.newRule.newDiscountPercent);
                draft.newRule.newSlotCount = "";
                draft.newRule.newDiscountPercent = "";
                break;
            case "REMOVE_DISCOUNT_FROM_NEW_RULE":
                delete draft.newRule.perSlotDiscounts[action.slots];
                break;
            case "RESET_NEW_RULE":
                draft.newRule = initialState.newRule;
                break;
            case "START_EDIT_RULE":
                draft.editingRuleId = action.rule._id;
                draft.editedRule = { ...action.rule };
                break;
            case "CANCEL_EDIT_RULE":
                draft.editingRuleId = null;
                draft.editedRule = null;
                break;
            case "SET_EDITED_RULE_FIELD":
                draft.editedRule[action.field] = action.value;
                break;
            case "ADD_DISCOUNT_TO_EDITED_RULE":
                draft.editedRule.perSlotDiscounts[draft.editedRule.newSlotCount] = Number(draft.editedRule.newDiscountPercent);
                draft.editedRule.newSlotCount = "";
                draft.editedRule.newDiscountPercent = "";
                break;
            case "REMOVE_DISCOUNT_FROM_EDITED_RULE":
                delete draft.editedRule.perSlotDiscounts[action.slots];
                break;
            default:
                break;
        }
    });
}

export default function PriceRule({ selectedStudio }) {
    const { data: priceRulesData, isLoading } = GetPriceRules(selectedStudio);
    const { mutate: deletePriceRule } = DeletePriceRule(selectedStudio);
    const { mutate: addNewRule } = AddPriceRule(selectedStudio);
    const { mutate: updatePriceRule } = UpdatedPriceRules();
    const { addToast } = useToast();
    const formatPrice = usePriceFormat();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [selectedRule, setSelectedRule] = useState(null);

    const { newRule } = state; // Destructure newRule from state

    const getDayName = (day) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day];

    const handleAddDiscountToNewRule = () => {
        const { newSlotCount, newDiscountPercent } = newRule;
        if (!newSlotCount || !newDiscountPercent) {
            addToast("Please fill in both slot count and discount percentage", "error");
            return;
        }
        dispatch({ type: "ADD_DISCOUNT_TO_NEW_RULE" });
    };

    const handleRemoveDiscountFromNewRule = (slots) => {
        dispatch({ type: "REMOVE_DISCOUNT_FROM_NEW_RULE", slots });
    };

    const handleAddPriceRule = () => {
        addNewRule({
            ...newRule,
            studio: selectedStudio,
            dayOfWeek: Number(newRule.dayOfWeek),
        }, {
            onSuccess: (response) => {
                addToast(response.message || "Price rule added successfully", "success");
                dispatch({ type: "RESET_NEW_RULE" });
            },
            onError: (error) => {
                addToast(error?.response?.data?.message || "Something went wrong", "error");
            },
        });
    };

    const handleEditRule = (rule) => {
        dispatch({ type: "START_EDIT_RULE", rule });
    };

    const handleSaveEdit = () => {
        updatePriceRule({ payload: state.editedRule }, {
            onSuccess: (response) => {
                addToast(response.message || "Price rule updated successfully", "success");
                dispatch({ type: "CANCEL_EDIT_RULE" });
            },
            onError: (error) => {
                addToast(error?.response?.data?.message || "Something went wrong", "error");
            },
        });
    };

    const handleCancelEdit = () => {
        dispatch({ type: "CANCEL_EDIT_RULE" });
    };

    const handleAddDiscountToEditedRule = () => {
        if (!state.editedRule.newSlotCount || !state.editedRule.newDiscountPercent) {
            addToast("Please fill in both slot count and discount percentage", "error");
            return;
        }
        dispatch({ type: "ADD_DISCOUNT_TO_EDITED_RULE" });
    };

    const handleRemoveDiscountFromEditedRule = (slots) => {
        dispatch({ type: "REMOVE_DISCOUNT_FROM_EDITED_RULE", slots });
    };

    const confirmDelete = () => {
        deletePriceRule({
            payload: { studio: selectedRule.studio, dayOfWeek: selectedRule.dayOfWeek },
        }, {
            onSuccess: (response) => {
                addToast(response.message || "Price rule deleted successfully", "success");
                setSelectedRule(null);
            },
            onError: (error) => {
                addToast(error?.response?.data?.message || "Something went wrong", "error");
            },
        });
    };

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-10">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 p-8 rounded-xl shadow-sm"
            >
                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                    Add New Price Rule
                </h3>

                {/* New Rule Form */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectInput
                            value={newRule.dayOfWeek}
                            placeholder=" Select a day..."
                            onChange={(e) =>
                                dispatch({
                                    type: "SET_NEW_RULE_FIELD",
                                    field: "dayOfWeek",
                                    value: e.target.value,
                                })
                            }
                            options={[0, 1, 2, 3, 4, 5, 6].map((day) => ({ value: day, label: getDayName(day) }))}
                        />

                        <Input
                            type="number"
                            label="Default Price per Slot"
                            value={newRule.defaultPricePerSlot}
                            onChange={(e) =>
                                dispatch({
                                    type: "SET_NEW_RULE_FIELD",
                                    field: "defaultPricePerSlot",
                                    value: Number(e.target.value),
                                })
                            }
                            min={0}
                        />
                    </div>

                    <div className="flex items-center mb-6">
                        <input
                            type="checkbox"
                            checked={newRule.isFixedHourly}
                            onChange={(e) =>
                                dispatch({
                                    type: "SET_NEW_RULE_FIELD",
                                    field: "isFixedHourly",
                                    value: e.target.checked,
                                })
                            }
                            className="w-5 h-5 text-rose-500 rounded"
                        />
                        <label className="ml-3 text-gray-700">Fixed Hourly Rate</label>
                    </div>

                    {/* Discount Section */}
                    {
                        !state.newRule.isFixedHourly && <>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h4 className="text-lg font-medium text-gray-800 mb-4">
                                    Add Discounts
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <Input
                                        type="number"
                                        label="Number of Slots"
                                        value={newRule.newSlotCount}
                                        onChange={(e) =>
                                            dispatch({
                                                type: "SET_NEW_RULE_FIELD",
                                                field: "newSlotCount",
                                                value: e.target.value,
                                            })
                                        }
                                        min={1}
                                        placeholder="Enter number of slots"
                                    />
                                    <Input
                                        type="number"
                                        label="Discount Percentage"
                                        value={newRule.newDiscountPercent}
                                        onChange={(e) =>
                                            dispatch({
                                                type: "SET_NEW_RULE_FIELD",
                                                field: "newDiscountPercent",
                                                value: e.target.value,
                                            })
                                        }
                                        min={0}
                                        max={100}
                                        placeholder="Enter discount percentage"
                                    />
                                </div>
                                <button
                                    onClick={handleAddDiscountToNewRule}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                >
                                    Add Discount
                                </button>
                                {/* Display discounts being added */}
                                {Object.entries(newRule.perSlotDiscounts).length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        {Object.entries(newRule.perSlotDiscounts).map(
                                            ([slots, discount]) => (
                                                <div
                                                    key={slots}
                                                    className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg text-gray-700"
                                                >
                                                    <span>
                                                        {slots} slots:
                                                        <span className="font-semibold ml-2 text-rose-500">
                                                            {discount}% discount
                                                        </span>
                                                    </span>
                                                    <button
                                                        onClick={() => handleRemoveDiscountFromNewRule(slots)}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    }
                    <button
                        onClick={handleAddPriceRule}
                        className="w-full px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm mt-6"
                    >
                        Create Price Rule
                    </button>
                </div>

                {/* Existing rules section remains unchanged */}
                {priceRulesData?.data.length > 0 && (
                    <div className="mt-8 space-y-6">
                        {priceRulesData?.data?.map((rule) => (
                            <motion.div
                                key={rule._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-lg shadow-sm"
                            >
                                <div className="flex justify-between items-center mb-4 gap-x-3">
                                    {state.editingRuleId === rule._id ? (
                                        <>
                                            <select
                                                value={state.editedRule.dayOfWeek}
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: "SET_EDITED_RULE_FIELD",
                                                        field: "dayOfWeek",
                                                        value: Number(e.target.value),
                                                    })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 transition-shadow"
                                            >
                                                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                                                    <option key={day} value={day}>
                                                        {getDayName(day)}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                value={state.editedRule.defaultPricePerSlot}
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: "SET_EDITED_RULE_FIELD",
                                                        field: "defaultPricePerSlot",
                                                        value: Number(e.target.value),
                                                    })
                                                }
                                                className="w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 transition-shadow"
                                                min={0}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <h4 className="text-lg font-medium text-gray-800">
                                                {getDayName(rule.dayOfWeek)}
                                            </h4>
                                            <span className="text-rose-500 font-semibold text-lg">
                                                {formatPrice(rule.defaultPricePerSlot)} per slot
                                            </span>
                                        </>
                                    )}
                                </div>

                                {state.editingRuleId === rule._id ? (
                                    <div className="flex items-center mb-4">
                                        <input
                                            type="checkbox"
                                            checked={state.editedRule.isFixedHourly}
                                            onChange={(e) =>
                                                dispatch({
                                                    type: "SET_EDITED_RULE_FIELD",
                                                    field: "isFixedHourly",
                                                    value: e.target.checked,
                                                })
                                            }
                                            className="w-5 h-5 text-rose-500 rounded"
                                        />
                                        <label className="ml-3 text-gray-700">
                                            Fixed Hourly Rate
                                        </label>
                                    </div>
                                ) : (
                                    <div className="flex items-center mb-4">
                                        <input
                                            type="checkbox"
                                            checked={rule.isFixedHourly}
                                            disabled
                                            className="w-5 h-5 text-rose-500 rounded opacity-60"
                                        />
                                        <label className="ml-3 text-gray-700">
                                            Fixed Hourly Rate
                                        </label>
                                    </div>
                                )}

                                {/* Display existing discounts */}
                                {Object.entries(
                                    state.editingRuleId === rule._id
                                        ? state.editedRule.perSlotDiscounts
                                        : rule.perSlotDiscounts
                                ).length > 0 && (
                                        <div className="mt-4 space-y-3">
                                            {Object.entries(
                                                state.editingRuleId === rule._id
                                                    ? state.editedRule.perSlotDiscounts
                                                    : rule.perSlotDiscounts
                                            ).map(([slots, discount]) => (
                                                <div
                                                    key={slots}
                                                    className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg text-gray-700"
                                                >
                                                    <span>
                                                        {slots} slots:
                                                        <span className="font-semibold ml-2 text-rose-500">
                                                            {discount}% discount
                                                        </span>
                                                    </span>
                                                    {state.editingRuleId === rule._id && (
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveDiscountFromEditedRule(slots)
                                                            }
                                                            className="text-red-500 hover:text-red-600"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                {state.editingRuleId === rule._id && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            type="number"
                                            label="Number of Slots"
                                            value={state.editedRule.newSlotCount}
                                            onChange={(e) =>
                                                dispatch({
                                                    type: "SET_EDITED_RULE_FIELD",
                                                    field: "newSlotCount",
                                                    value: e.target.value,
                                                })
                                            }
                                            min={1}
                                            placeholder="Enter number of slots"
                                        />
                                        <Input
                                            type="number"
                                            label="Discount Percentage"
                                            value={state.editedRule.newDiscountPercent}
                                            onChange={(e) =>
                                                dispatch({
                                                    type: "SET_EDITED_RULE_FIELD",
                                                    field: "newDiscountPercent",
                                                    value: e.target.value,
                                                })
                                            }
                                            min={0}
                                            max={100}
                                            placeholder="Enter discount percentage"
                                        />
                                        <button
                                            onClick={handleAddDiscountToEditedRule}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                        >
                                            Add Discount
                                        </button>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-4">
                                    {state.editingRuleId === rule._id ? (
                                        <>
                                            <button
                                                onClick={handleSaveEdit}
                                                className="px-4 py-2 text-green-500 hover:text-green-600 text-sm block w-fit text-left border border-green-500 rounded-lg"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-4 py-2 text-gray-500 hover:text-gray-600 text-sm block w-fit text-left border border-gray-500 rounded-lg"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setSelectedRule(rule)}
                                                className="px-4 py-2 text-red-500 hover:text-red-600 text-sm block w-fit text-left border border-red-500 rounded-lg"
                                            >
                                                Delete Rule
                                            </button>
                                            <button
                                                onClick={() => handleEditRule(rule)}
                                                className="px-4 py-2 text-blue-500 hover:text-blue-600 text-sm block w-fit text-left border border-blue-500 rounded-lg"
                                            >
                                                Edit Rule
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Delete Modal */}
                {selectedRule && (
                    <AnimatePresence>
                        <Popup>
                            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                            <p className="mb-4">Are you sure you want to delete this Rule?</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedRule(null)}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </Popup>
                    </AnimatePresence>
                )}
            </motion.div>
        </div>
    );
}