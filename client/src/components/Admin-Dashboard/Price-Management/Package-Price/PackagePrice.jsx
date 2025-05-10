// /* eslint-disable no-case-declarations */
import { useReducer, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../../shared/Input/Input";
import {
    UpdatedPriceRules,
    AddPriceRule,
    GetPriceRules,
    DeletePriceRule,
} from "../../../../apis/price/price.api";
import { useToast } from "../../../../context/Toaster-Context/ToasterContext";
import { produce } from "immer";
import DiscountList from "../Discount-List/DiscountList";
import PriceRuleCard from "../Price-Rule-Card/PriceRuleCard";
import EditRuleForm from "../Edit-Rule-Form/EditRuleForm";

export default function PackagePrice({ selectedPackage }) {
    const packageData = selectedPackage;
    const { mutate: editPricePackage } = UpdatedPriceRules();
    const { data: rules } = GetPriceRules(packageData._id);
    const { mutate: deletePriceRule } = DeletePriceRule();
    const { mutate: addPriceRule } = AddPriceRule();
    const { addToast } = useToast();
    const [editingRule, setEditingRule] = useState(null);

    const initialState = {
        defaultPricePerSlot: packageData?.price || 0,
        isFixedHourly: packageData?.isFixedHourly || false,
        perHourDiscounts: packageData?.perHourDiscounts || {},
        newRule: {
            isFixedHourly: false,
            defaultPricePerSlot: "",
            perHourDiscounts: {},
            days: [],
        },
        newSlotCount: "",
        newDiscountPercent: "",
    };

    function reducer(state, action) {
        return produce(state, (draft) => {
            switch (action.type) {
                case "SET_NEW_RULE_FIELD":
                    draft.newRule[action.field] = action.value;
                    break;
                case "ADD_DISCOUNT":
                    draft.newRule.perHourDiscounts[draft.newSlotCount] =
                        draft.newDiscountPercent;
                    draft.newSlotCount = "";
                    draft.newDiscountPercent = "";
                    break;
                case "REMOVE_DISCOUNT":
                    delete draft.newRule.perHourDiscounts[action.slotCount];
                    break;
                case "RESET_NEW_RULE":
                    draft.newRule = {
                        isFixedHourly: false,
                        defaultPricePerSlot: "",
                        perHourDiscounts: {},
                        days: [],
                    };
                    break;
                case "TOGGLE_FIXED_HOURLY":
                    draft.isFixedHourly = action.value;
                    break;
                case "TOGGLE_DAY": {
                    const index = draft.newRule.days.indexOf(action.day);
                    if (index > -1) {
                        draft.newRule.days.splice(index, 1); // Remove if already selected
                    } else {
                        draft.newRule.days.push(action.day); // Add if not selected
                    }
                    break;
                }
                default:
                    break;
            }
        });
    }

    const handleAddDiscountToNewRule = () => {
        if (state.newSlotCount && state.newDiscountPercent) {
            dispatch({ type: "ADD_DISCOUNT" });
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const updatePackagePrice = (
        payloadOverrides,
        onSuccessMessage,
        extraDispatch = null
    ) => {
        console.log(payloadOverrides);
        const payload = {
            isFixed: payloadOverrides.isFixedHourly,
            defaultPricePerSlot: payloadOverrides.defaultPricePerSlot,
            perHourDiscounts: payloadOverrides.isFixedHourly
                ? {}
                : payloadOverrides.perHourDiscounts,
            package: payloadOverrides.package,
            dayOfWeek: payloadOverrides.dayOfWeek,
            ...payloadOverrides,
        };

        editPricePackage(
            {
                payload,
            },
            {
                onSuccess: (response) => {
                    if (extraDispatch) dispatch(extraDispatch);
                    addToast(response?.message || onSuccessMessage, "success");
                },
                onError: (error) => {
                    addToast(
                        error?.response?.data?.message || "Something went wrong",
                        "error"
                    );
                    console.log(error);
                },
            }
        );
    };

    const handleSaveNewRule = () => {
        const { defaultPricePerSlot, isFixedHourly, perHourDiscounts, days } =
            state.newRule;

        if (!days || days.length === 0) {
            addToast("Please select at least one day", "error");
            return;
        }

        const payloadArray = days.map((day) => ({
            package: packageData._id,
            dayOfWeek: day,
            isFixedHourly,
            defaultPricePerSlot: Number(defaultPricePerSlot),
            perSlotDiscounts: isFixedHourly ? {} : perHourDiscounts,
        }));

        addPriceRule(
            { rules: payloadArray }, // send array of rules
            {
                onSuccess: (res) => {
                    dispatch({ type: "RESET_NEW_RULE" });
                    addToast(res?.message || "Rules added successfully", "success");
                },
                onError: (err) => {
                    addToast(
                        err?.response?.data?.message || "Something went wrong",
                        "error"
                    );
                    console.error(err);
                },
            }
        );
    };

    const handleDeleteRule = (rule) => {
        deletePriceRule(
            {
                payload: {
                    id: rule._id,
                },
            },
            {
                onSuccess: (res) => {
                    addToast(res?.message || "Rule removed successfully", "success");
                },
                onError: (err) => {
                    addToast(
                        err?.response?.data?.message || "Something went wrong",
                        "error"
                    );
                    console.error(err);
                },
            }
        );
    };
    const handleEditRule = (rule) => {
        setEditingRule(rule);
    };

    const handleSaveEditedRule = (editedRule) => {
        console.log(editedRule);
        updatePackagePrice(editedRule, "Rule updated successfully");
        setEditingRule(null);
    };

    const handleCancelEdit = () => {
        setEditingRule(null);
    };

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold mb-6 text-gray-800"
            >
                <motion.span
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mr-2 block text-center border border-transparent border-b-main rounded-full pb-2"
                >
                    {packageData?.name}
                </motion.span>
            </motion.div>

            {/* Price Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-white to-gray-50 p-3 rounded-xl shadow-sm border border-gray-100 mb-8"
            >
                <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-semibold mb-6 text-gray-800 flex items-center"
                >
                    <i className="fa-solid fa-plus mr-2 text-rose-500 text-[20px]"></i>
                    Add New Package Price Rule
                </motion.h3>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            type="number"
                            label="Default Price per Slot"
                            value={state.newRule.defaultPricePerSlot}
                            onChange={(e) =>
                                dispatch({
                                    type: "SET_NEW_RULE_FIELD",
                                    field: "defaultPricePerSlot",
                                    value: Number(e.target.value),
                                })
                            }
                            placeholder="Enter default price per slot"
                            className="flex-1 m-0"
                        />

                        <div className="flex items-center space-x-3 ">
                            <input
                                type="checkbox"
                                id="newRuleFixedHourly"
                                checked={state.newRule.isFixedHourly}
                                onChange={(e) =>
                                    dispatch({
                                        type: "SET_NEW_RULE_FIELD",
                                        field: "isFixedHourly",
                                        value: e.target.checked,
                                    })
                                }
                                className="w-5 h-5 text-rose-500 rounded"
                            />
                            <label htmlFor="newRuleFixedHourly" className="text-gray-700">
                                Fixed Hourly Rate
                            </label>
                        </div>
                    </div>

                    {!state.newRule.isFixedHourly && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
                        >
                            <h4 className="text-lg font-medium text-gray-800 mb-6 flex items-center">
                                <i className="fa-solid fa-sterling-sign mr-2 text-amber-500 text-[18px]"></i>
                                Add Discounts
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input
                                    type="number"
                                    label="Number of Slots"
                                    value={state.newRule.newSlotCount}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "SET_NEW_RULE_FIELD",
                                            field: "newSlotCount",
                                            value: Number(e.target.value),
                                        })
                                    }
                                    min={1}
                                    placeholder="Enter number of slots"
                                />
                                <Input
                                    type="number"
                                    label="Discount Percentage"
                                    value={state.newRule.newDiscountPercent}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "SET_NEW_RULE_FIELD",
                                            field: "newDiscountPercent",
                                            value: Number(e.target.value),
                                        })
                                    }
                                    min={0}
                                    max={100}
                                    placeholder="Enter discount percentage"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleAddDiscountToNewRule}
                                className="flex items-center px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors text-sm"
                            >
                                <i className="fa-solid fa-plus mr-2 text-rose-500 text-[20px]"></i>
                                Add Discount
                            </motion.button>

                            <DiscountList
                                discounts={state.newRule.perHourDiscounts}
                                isEditing={true}
                                onDelete={(slot) =>
                                    dispatch({ type: "REMOVE_DISCOUNT", slotCount: slot })
                                }
                            />
                        </motion.div>
                    )}

                    <div>
                        <label className="block text-gray-700 font-medium mb-3">
                            Apply Rule On:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {days.map((day, index) => (
                                <motion.label
                                    key={index}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`flex items-center space-x-2 p-3 rounded-lg border ${state?.newRule?.days?.includes(index)
                                            ? "border-rose-200 bg-rose-50"
                                            : "border-gray-200 bg-white"
                                        } hover:bg-gray-50 cursor-pointer transition-colors`}
                                >
                                    <input
                                        type="checkbox"
                                        value={index}
                                        checked={state?.newRule?.days?.includes(index)}
                                        onChange={() =>
                                            dispatch({ type: "TOGGLE_DAY", day: index })
                                        }
                                        className="w-4 h-4 text-rose-500 rounded"
                                    />
                                    <span className="text-gray-700">{day}</span>
                                </motion.label>
                            ))}
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveNewRule}
                        className="w-full px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-colors shadow-sm mt-6 flex items-center justify-center"
                    >
                        <i className="fa-solid fa-floppy-disk mr-2 text-[18px]"></i>Apply
                        Change in Package Price
                    </motion.button>
                </div>
            </motion.div>

            {/* Price Rules List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-sm border border-gray-100">
                    <motion.h3
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl font-semibold mb-6 text-gray-800 flex items-center"
                    >
                        <i className="fa-solid fa-calendar-days mr-2 text-rose-500 text-[20px]"></i>
                        Special Price Rules
                    </motion.h3>

                    {rules && rules?.data?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {rules?.data?.map((rule) =>
                                    editingRule && editingRule._id === rule._id ? (
                                        <EditRuleForm
                                            key={`edit-${rule._id}`}
                                            rule={rule}
                                            onSave={handleSaveEditedRule}
                                            onCancel={handleCancelEdit}
                                        />
                                    ) : (
                                        <PriceRuleCard
                                            key={rule._id}
                                            rule={rule}
                                            onEdit={handleEditRule}
                                            onDelete={handleDeleteRule}
                                        />
                                    )
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white p-8 rounded-lg text-center border border-gray-100"
                        >
                            <p className="text-gray-500 text-lg">
                                No special price rules configured yet
                            </p>
                            <p className="text-gray-400 mt-2">
                                Add a new rule using the form above
                            </p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </>
    );
}
