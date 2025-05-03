/* eslint-disable no-case-declarations */
import React, { useReducer } from 'react';
import { motion } from 'framer-motion';
import Input from '../../../shared/Input/Input';
import { EditPricePackage } from '../../../../apis/price/price.api';
import { useToast } from '../../../../context/Toaster-Context/ToasterContext';
import usePriceFormat from '../../../../hooks/usePriceFormat';

// Reducer setup
const initialState = {
    isDay: true,
    dayOfWeek: '',
    dayOfMonth: '',
    defaultPricePerSlot: '',
    isFixedHourly: false,
    newSlotCount: '',
    newDiscountPercent: '',
    perHourDiscounts: {},
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_NEW_RULE_FIELD':
            return {
                ...state,
                [action.field]: action.value,
            };
        case 'ADD_DISCOUNT':
            return {
                ...state,
                perHourDiscounts: {
                    ...state.perHourDiscounts,
                    [state.newSlotCount]: state.newDiscountPercent,
                },
                newSlotCount: '',
                newDiscountPercent: '',
            };
        case 'REMOVE_DISCOUNT':
            const updatedDiscounts = { ...state.perHourDiscounts };
            delete updatedDiscounts[action.slotCount];
            return {
                ...state,
                perHourDiscounts: updatedDiscounts,
            };
        default:
            return state;
    }
}

export default function PackagePrice({ selectedPackage }) {
    const [newRule, dispatch] = useReducer(reducer, initialState);
    const priceFormat = usePriceFormat()

    const { mutate: editPricePackage } = EditPricePackage()
    const { addToast } = useToast();

    const handleSaveNewRule = () => {
        editPricePackage({
            id: selectedPackage._id,
            payload: {
                price: newRule.defaultPricePerSlot,
                isFixedHourly: newRule.isFixedHourly,
                perHourDiscounts: newRule.perHourDiscounts
            }
        },

            {
                onSuccess: (response) => {
                    dispatch({ type: 'RESET_NEW_RULE' });
                    addToast(response.message || 'Package price updated successfully', 'success');
                },
                onError: (error) => {
                    addToast(error?.response?.data?.message || 'Something went wrong', 'error');
                    console.log(error);
                }
            });
    }
    const handleAddDiscountToNewRule = () => {
        if (newRule.newSlotCount && newRule.newDiscountPercent) {
            dispatch({ type: 'ADD_DISCOUNT' });
        }
    };

    console.log(selectedPackage?.price);
    return (
        <>
            <div className="text-2xl font-bold mb-4">{selectedPackage?.name}</div>

            {
                 <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-50 p-8 rounded-xl shadow-sm"
                >
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">
                        Add New Package Price
                    </h3>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                type="number"
                                label="Default Price per Slot"
                                value={newRule.defaultPricePerSlot}
                                onChange={(e) =>
                                    dispatch({
                                        type: 'SET_NEW_RULE_FIELD',
                                        field: 'defaultPricePerSlot',
                                        value: Number(e.target.value),
                                    })
                                }
                                placeholder="Enter default price per slot"
                                className={"flex-1"}
                            />


                            <div className="flex items-center mb-6">
                                <input
                                    type="checkbox"
                                    checked={newRule.isFixedHourly}
                                    onChange={(e) =>
                                        dispatch({
                                            type: 'SET_NEW_RULE_FIELD',
                                            field: 'isFixedHourly',
                                            value: e.target.checked,
                                        })
                                    }
                                    className="w-5 h-5 text-rose-500 rounded"
                                />
                                <label className="ml-3 text-gray-700">Fixed Hourly Rate</label>
                            </div>
                        </div>

                        {!newRule.isFixedHourly && (
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h4 className="text-lg font-medium text-gray-800 mb-6">
                                    Add Discounts
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <Input
                                        type="number"
                                        label="Number of Slots"
                                        value={newRule.newSlotCount}
                                        onChange={(e) =>
                                            dispatch({
                                                type: 'SET_NEW_RULE_FIELD',
                                                field: 'newSlotCount',
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
                                                type: 'SET_NEW_RULE_FIELD',
                                                field: 'newDiscountPercent',
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
                                {Object.entries(newRule.perHourDiscounts).length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        {Object.entries(newRule.perHourDiscounts).map(
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
                                                        onClick={() =>
                                                            dispatch({
                                                                type: 'REMOVE_DISCOUNT',
                                                                slotCount: slots,
                                                            })
                                                        }
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
                        )}

                        <button
                            onClick={() => {
                                handleSaveNewRule()
                                console.log('Package Price Rule:', newRule);
                            }}
                            className="w-full px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm mt-6"
                        >
                            Add Package Price Rule
                        </button>
                    </div>
                </motion.div>
            }

            {
                <motion.div>
                    <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
                        <div className='flex justify-between items-center '>
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">
                                Package Price
                            </h3>

                            <p>
                                {priceFormat(selectedPackage.price)} Per Hour
                            </p>
                        </div>

                        <div className="space-y-6">
                            <DiscountList discounts={selectedPackage.perHourDiscounts} isEditing={false} />
                        </div>
                    </div>
                </motion.div>
            }
        </>
    );
}

const DiscountList = ({ discounts, isEditing, handleRemoveDiscount }) => (
    <>
        {Object.entries(discounts).length > 0 && (
            <div className="mt-4 space-y-3 ">
                {Object.entries(discounts).map(([slots, discount]) => (
                    <div
                        key={slots}
                        className="flex justify-between items-center text-sm bg-white p-6 rounded-lg p-3 text-gray-700"
                    >
                        <span>
                            {slots} hour:
                            <span className="font-semibold ml-2 text-rose-500">{discount}% discount</span>
                        </span>
                        {isEditing && (
                            <button
                                onClick={() => handleRemoveDiscount(slots)}
                                className="text-red-500 hover:text-red-600"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
            </div>
        )}
    </>
);
