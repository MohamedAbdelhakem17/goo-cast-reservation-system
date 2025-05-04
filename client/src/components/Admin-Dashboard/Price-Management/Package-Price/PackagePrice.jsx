import React, { useReducer } from "react";
import { motion } from "framer-motion";
import Input from "../../../shared/Input/Input";
import { EditPricePackage } from "../../../../apis/price/price.api";
import { useToast } from "../../../../context/Toaster-Context/ToasterContext";
import usePriceFormat from "../../../../hooks/usePriceFormat";
import { produce } from "immer";
import {  DiscountList } from "../Price-Mange/PriceComponents";

export default function PackagePrice({ selectedPackage }) {
    const priceFormat = usePriceFormat();
    const { mutate: editPricePackage } = EditPricePackage();
    const { addToast } = useToast();

    const initialState = {
        defaultPricePerSlot: selectedPackage?.price || 0,
        isFixedHourly: selectedPackage?.isFixedHourly || false,
        perHourDiscounts: selectedPackage?.perHourDiscounts || {},
        newRule: {
            isFixedHourly: false,
            defaultPricePerSlot: "",
            perHourDiscounts: {},
            newSlotCount: "",
            newDiscountPercent: "",
        },
    };

    function reducer(state, action) {
        return produce(state, (draft) => {
            switch (action.type) {
                case "SET_NEW_RULE_FIELD":
                    draft.newRule[action.field] = action.value;
                    break;
                case "ADD_DISCOUNT":
                    draft.newRule.perHourDiscounts[draft.newRule.newSlotCount] =
                        draft.newRule.newDiscountPercent;
                    draft.newRule.newSlotCount = "";
                    draft.newRule.newDiscountPercent = "";
                    break;
                case "REMOVE_DISCOUNT":
                    delete draft.newRule.perHourDiscounts[action.slotCount];
                    break;
                case "RESET_NEW_RULE":
                    draft.newRule = {
                        isFixedHourly: false,
                        defaultPricePerSlot: "",
                        perHourDiscounts: {},
                        newSlotCount: "",
                        newDiscountPercent: "",
                    };
                    break;
                case "TOGGLE_FIXED_HOURLY":
                    draft.isFixedHourly = action.value;
                    break;
                default:
                    break;
            }
        });
    }

    const handleAddDiscountToNewRule = () => {
        if (state.newRule.newSlotCount && state.newRule.newDiscountPercent) {
            dispatch({ type: "ADD_DISCOUNT" });
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);
    const updatePackagePrice = (
        payloadOverrides,
        onSuccessMessage,
        extraDispatch = null
    ) => {
        const payload = {
            price: selectedPackage.price,
            isFixed: selectedPackage.isFixedHourly,
            perHourDiscounts: selectedPackage.perHourDiscounts,
            ...payloadOverrides,
        };

        editPricePackage(
            {
                id: selectedPackage._id,
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
        const updatedPayload = {
            price: state.newRule.defaultPricePerSlot || selectedPackage.price,
            isFixed: state.newRule.isFixedHourly,
            perHourDiscounts: {
                ...selectedPackage.perHourDiscounts,
                ...state.newRule.perHourDiscounts,
            },
        };

        updatePackagePrice(updatedPayload, "Package price updated successfully", {
            type: "RESET_NEW_RULE",
        });
    };

    const handleRemoveExistingDiscount = (slotToRemove) => {
        const updatedDiscounts = { ...selectedPackage.perHourDiscounts };
        delete updatedDiscounts[slotToRemove];

        updatePackagePrice(
            { perHourDiscounts: updatedDiscounts },
            "Discount removed successfully"
        );
    };

    const handelChangePriceType = () => {
        const newIsFixed = false;

        updatePackagePrice(
            { isFixed: newIsFixed },
            "Price type changed to flexible.",
            { type: "TOGGLE_FIXED_HOURLY", value: newIsFixed }
        );
    };

    return (
        <>
            <div className="text-2xl font-bold mb-4">{selectedPackage?.name}</div>

            {/* Price Form  */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                    Add New Package Price
                </h3>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input type="number" label="Default Price per Slot" value={state.newRule.defaultPricePerSlot}
                            onChange={(e) =>
                                dispatch({
                                    type: "SET_NEW_RULE_FIELD",
                                    field: "defaultPricePerSlot",
                                    value: Number(e.target.value),
                                })
                            }
                            placeholder="Enter default price per slot"
                            className="flex-1"
                        />

                        <div className="flex items-center mb-6">
                            <input type="checkbox" checked={state.newRule.isFixedHourly} onChange={(e) =>
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
                    </div>

                    {!state.newRule.isFixedHourly && (
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h4 className="text-lg font-medium text-gray-800 mb-6">
                                Add Discounts
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input type="number" label="Number of Slots" value={state.newRule.newSlotCount} onChange={(e) =>
                                    dispatch({
                                        type: "SET_NEW_RULE_FIELD",
                                        field: "newSlotCount",
                                        value: e.target.value,
                                    })
                                }
                                    min={1}
                                    placeholder="Enter number of slots"
                                />
                                <Input type="number" label="Discount Percentage" value={state.newRule.newDiscountPercent}
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
                            <button onClick={handleAddDiscountToNewRule}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                                Add Discount
                            </button>

                            <DiscountList discounts={state.newRule.perHourDiscounts} isEditing={true} onDelete={(slot) =>
                                dispatch({ type: "REMOVE_DISCOUNT", slotCount: slot })
                            }
                            />
                        </div>
                    )}

                    <button onClick={handleSaveNewRule}
                        className="w-full px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm mt-6">
                        Apply Change in Package Price
                    </button>
                </div>
            </motion.div>

            {/* Price List */}
            <motion.div>
                <div className="bg-gray-50 p-8 rounded-xl shadow-sm mt-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold mb-6 text-gray-800">
                            Package Price
                        </h3>
                        <p>{priceFormat(selectedPackage.price)} Per Hour</p>
                    </div>
                    {selectedPackage.isFixed && (
                        <div className="flex justify-between items-center mt-2 mb-4">
                            <p className="text-md text-gray-600">
                                This is a Fixed Hourly Rate and discounts not apply
                            </p>
                            <button onClick={handelChangePriceType} className="text-red-500 hover:text-red-600">
                                Change Price Type
                            </button>
                        </div>
                    )}
                    <div className="space-y-6">
                        {Object.entries(selectedPackage.perHourDiscounts).length > 0 ? (
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h4 className="text-lg font-medium text-gray-800 mb-6">
                                    Discounts
                                </h4>
                                <DiscountList discounts={selectedPackage.perHourDiscounts} isEditing={true}
                                    onDelete={handleRemoveExistingDiscount} />
                            </div>
                        ) : (
                            <p className="font-semibold text-center  text-xl  bg-white p-6 rounded-lg text-main mt-4  ">
                                No discounts
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
}

