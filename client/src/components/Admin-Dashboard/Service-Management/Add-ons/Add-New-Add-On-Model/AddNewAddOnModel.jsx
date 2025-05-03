import React, { useReducer } from 'react';
import { useFormik } from 'formik';
import { produce } from 'immer';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import Input from '../../../../shared/Input/Input';
import { AddNewAddOn } from '../../../../../apis/services/services.api';
import { useToast } from '../../../../../context/Toaster-Context/ToasterContext';

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Add-on name is required')
        .min(3, 'Name must be at least 3 characters'),
    description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters'),
    price: Yup.number()
        .required('Price is required')
        .positive('Price must be positive'),
    image: Yup.mixed()
        .required('Image is required')
        .test('fileFormat', 'Unsupported image format', (value) => {
            const allowedFormats = ['image/jpeg', 'image/png'];
            return value && allowedFormats.includes(value.type);
        }),
    isFixed: Yup.boolean().required(),
    perHourDiscounts: Yup.object().test(
        'required-if-not-fixed',
        'Per Hour Discounts is required when price is not fixed',
        function (value) {
            const { isFixed } = this.parent;
            if (!isFixed && (!value || Object.keys(value).length === 0)) {
                return false;
            }
            return true;
        }
    ),
});

const initialRuleState = {
    newSlotCount: '',
    newDiscountPercent: '',
    perSlotDiscounts: {},
};

function ruleReducer(state, action) {
    return produce(state, (draft) => {
        switch (action.type) {
            case 'SET_NEW_RULE_FIELD':
                draft[action.field] = action.value;
                break;
            case 'ADD_DISCOUNT':
                if (!draft.newSlotCount || !draft.newDiscountPercent) return;
                draft.perSlotDiscounts[draft.newSlotCount] = draft.newDiscountPercent;
                draft.newSlotCount = '';
                draft.newDiscountPercent = '';
                break;
            case 'REMOVE_DISCOUNT':
                delete draft.perSlotDiscounts[action.payload];
                break;
            case 'RESET_DISCOUNTS':
                draft.perSlotDiscounts = {};
                break;
            default:
                break;
        }
    });
}
export default function AddNewAddOnModel({ closeModel }) {
    const [newRule, dispatch] = useReducer(ruleReducer, initialRuleState);

    const { mutate: addNewAddOn, isLoading } = AddNewAddOn();
    const { addToast } = useToast();

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            price: '',
            image: '',
            perHourDiscounts: {},
            isFixed: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            const finalValues = {
                ...values,
                perHourDiscounts: newRule.perSlotDiscounts,
            };
            addNewAddOn(finalValues, {
                onSuccess: () => {
                    addToast('Add-on added successfully', 'success');
                    closeModel();
                },
                onError: (error) => {
                    addToast(error.response?.data?.message || 'Something went wrong', 'error');
                },
            });
        },
    });

    function handleAddDiscountToNewRule(e) {
        e.preventDefault();
        dispatch({ type: 'ADD_DISCOUNT' });
    }

    function handleRemoveDiscountFromNewRule(e, slot) {
        e.preventDefault();
        dispatch({ type: 'REMOVE_DISCOUNT', payload: slot });
    }

    function handleAddImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            formik.setFieldValue('image', file);
        }
    }

    function handleResetDiscounts() {
        const isChecked = !formik.values.isFixed;
        formik.setFieldValue('isFixed', isChecked);
        if (isChecked) {
            formik.setFieldValue('perHourDiscounts', {});
            dispatch({ type: 'RESET_DISCOUNTS' });
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-md w-1/2 max-h-[90vh] overflow-y-auto"  
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Add New Add-On</h2>
                    <span
                        className="h-6 text-white bg-main w-6 rounded-full flex justify-center items-center cursor-pointer"
                        onClick={closeModel}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </span>
                </div>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Name For Add-on */}
                    <Input
                        label="Name"
                        id="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errors={formik.touched.name && formik.errors.name}
                        touched={formik.touched.name}
                        placeholder="Enter add-on name"
                    />

                    {/* Description For Add-on */}
                    <Input
                        label="Description"
                        id="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errors={formik.touched.description && formik.errors.description}
                        touched={formik.touched.description}
                        placeholder="Enter add-on description"
                    />

                    {/* Price For Add-on */}
                    <div className="flex flex-row gap-x-4 items-center">
                        <Input
                            label="Price"
                            id="price"
                            type="number"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            errors={formik.touched.price && formik.errors.price}
                            touched={formik.touched.price}
                            placeholder="Enter add-on price"
                            className="flex-1 mb-3"
                        />

                        {/* IS FIXED */}
                        <div className="flex items-center gap-x-2 mb-3">
                            <input
                                id="isFixed"
                                name="isFixed"
                                type="checkbox"
                                checked={formik.values.isFixed}
                                onChange={handleResetDiscounts}
                                onBlur={formik.handleBlur}
                            />
                            <label htmlFor="isFixed">Fixed Price</label>
                        </div>
                    </div>

                    {/* Discounts For Add-on Per Hour */}
                    {!formik.values.isFixed && (
                        <div>
                            <h4 className="text-lg font-medium text-gray-800 mb-4">Add Discounts</h4>
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
                            {Object.entries(newRule.perSlotDiscounts).length > 0 && (
                                <div className="mt-4 space-y-3">
                                    {Object.entries(newRule.perSlotDiscounts).map(([slots, discount]) => (
                                        <div
                                            key={slots}
                                            className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg text-gray-700"
                                        >
                                            <span>
                                                {slots} slots:
                                                <span className="font-semibold ml-2 text-rose-500">{discount}% discount</span>
                                            </span>
                                            <button className="text-red-500 hover:text-red-600" onClick={(e) => handleRemoveDiscountFromNewRule(e, slots)}>
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Add Image */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="image">Add Image</label>
                        <input
                            type="file"
                            id="image"
                            onChange={handleAddImageUpload}
                            onBlur={formik.handleBlur}
                            className="border border-gray-300 p-2 rounded-md w-full"
                        />
                        {formik.touched.image && formik.errors.image && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="mt-1 flex items-center space-x-1 text-sm text-red-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{formik.errors.image}</span>
                            </motion.div>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        disabled={!formik.isValid || isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-main text-white py-3 rounded-md font-medium hover:bg-main/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {formik.isSubmitting ? 'Adding...' : 'Add Add-On'}
                    </motion.button>
                </form>
            </motion.div>
        </>
    );
}
