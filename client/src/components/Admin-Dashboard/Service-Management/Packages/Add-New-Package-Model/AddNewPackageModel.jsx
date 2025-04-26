import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '../../../../shared/Input/Input';
import Alert from '../../../../shared/Alert/Alert';
import { AddNewPackage } from '../../../../../apis/services/services.api';

const validationSchema = Yup.object({
    name: Yup.string().required('Package name is required').min(3, 'Name must be at least 3 characters'),
    description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    details: Yup.array().of(Yup.string().required('Detail is required')).min(1, 'At least one detail is required'),
    prices: Yup.object({
        twoHours: Yup.number().required('Two hours price is required').min(0, 'Price must be a positive number'),
        halfDay: Yup.number().required('Half day price is required').min(0, 'Price must be a positive number'),
        fullDay: Yup.number().required('Full day price is required').min(0, 'Price must be a positive number'),
    }),
    savings: Yup.object({
        halfDay: Yup.number().required('Half day saving is required').min(0, 'Saving must be a positive number'),
        fullDay: Yup.number().required('Full day saving is required').min(0, 'Saving must be a positive number'),
    }),
    icon: Yup.string().required('Icon is required'),
});

export default function AddNewPackageModel({ closeModel }) {
    const [currentDetail, setCurrentDetail] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { mutate: addPackage } = AddNewPackage();

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            details: [],
            prices: { twoHours: '', halfDay: '', fullDay: '' },
            savings: { halfDay: '', fullDay: '' },
            icon: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await addPackage({
                    ...values,
                    prices: {
                        twoHours: Number(values.prices.twoHours),
                        halfDay: Number(values.prices.halfDay),
                        fullDay: Number(values.prices.fullDay),
                    },
                    savings: {
                        halfDay: Number(values.savings.halfDay),
                        fullDay: Number(values.savings.fullDay),
                    },
                });
                setShowSuccessAlert(true);
                setTimeout(() => {
                    closeModel();
                }, 2000);
            } catch (error) {
                setErrorMessage(error.message || 'Something went wrong');
                setShowErrorAlert(true);
                setTimeout(() => {
                    setShowErrorAlert(false);
                }, 3000);
            }
        },
    });

    const handleAddDetail = () => {
        if (currentDetail.trim()) {
            formik.setFieldValue('details', [...formik.values.details, currentDetail.trim()]);
            setCurrentDetail('');
        }
    };

    const handleRemoveDetail = (index) => {
        const updatedDetails = formik.values.details.filter((_, i) => i !== index);
        formik.setFieldValue('details', updatedDetails);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto bg-black/30"
        >
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Package</h2>
                    <span
                        onClick={closeModel}
                        className="text-gray-600 hover:text-gray-800 cursor-pointer text-2xl"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </span>
                </div>

                {/* Alerts */}
                <AnimatePresence>
                    {showSuccessAlert && <Alert type="success">Package added successfully!</Alert>}
                    {showErrorAlert && <Alert type="error">{errorMessage}</Alert>}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="space-y-6">

                    {/* Basic Info */}
                    <Input
                        label="Name"
                        id="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errors={formik.touched.name && formik.errors.name}
                        touched={formik.touched.name}
                        placeholder="Enter package name"
                    />

                    <Input
                        label="Description"
                        id="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errors={formik.touched.description && formik.errors.description}
                        touched={formik.touched.description}
                        placeholder="Enter package description"
                    />

                    {/* Details */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Package Details</label>
                        <div className="flex gap-2 items-center">
                            <Input
                                value={currentDetail}
                                onChange={(e) => setCurrentDetail(e.target.value)}
                                placeholder="Enter detail"
                                className="flex-1"
                            />
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddDetail}
                                className="px-4 py-2 bg-main text-white rounded-md hover:bg-main/90"
                            >
                                Add
                            </motion.button>
                        </div>

                        {formik.touched.details && formik.errors.details && (
                            <div className="text-red-500 text-sm">{formik.errors.details}</div>
                        )}

                        <ul className="space-y-2">
                            {formik.values.details.map((detail, index) => (
                                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <span>{detail}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveDetail(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Prices & Savings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Two Hours Full Width */}
                        <div className="col-span-1 md:col-span-2">
                            <Input
                                label="Two Hours Price"
                                id="prices.twoHours"
                                type="number"
                                value={formik.values.prices.twoHours}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                errors={formik.touched.prices?.twoHours && formik.errors.prices?.twoHours}
                                touched={formik.touched.prices?.twoHours}
                                placeholder="Enter two hours price"
                            />
                        </div>

                        {/* Half & Full Day Prices */}
                        <Input
                            label="Half Day Price"
                            id="prices.halfDay"
                            type="number"
                            value={formik.values.prices.halfDay}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            errors={formik.touched.prices?.halfDay && formik.errors.prices?.halfDay}
                            touched={formik.touched.prices?.halfDay}
                            placeholder="Enter half day price"
                        />

                        <Input
                            label="Full Day Price"
                            id="prices.fullDay"
                            type="number"
                            value={formik.values.prices.fullDay}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            errors={formik.touched.prices?.fullDay && formik.errors.prices?.fullDay}
                            touched={formik.touched.prices?.fullDay}
                            placeholder="Enter full day price"
                        />

                        {/* Savings */}
                        <Input
                            label="Half Day Saving"
                            id="savings.halfDay"
                            type="number"
                            value={formik.values.savings.halfDay}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            errors={formik.touched.savings?.halfDay && formik.errors.savings?.halfDay}
                            touched={formik.touched.savings?.halfDay}
                            placeholder="Enter half day saving"
                        />

                        <Input
                            label="Full Day Saving"
                            id="savings.fullDay"
                            type="number"
                            value={formik.values.savings.fullDay}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            errors={formik.touched.savings?.fullDay && formik.errors.savings?.fullDay}
                            touched={formik.touched.savings?.fullDay}
                            placeholder="Enter full day saving"
                        />
                    </div>

                    {/* Icon */}
                    <Input
                        label="Icon"
                        id="icon"
                        value={formik.values.icon}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errors={formik.touched.icon && formik.errors.icon}
                        touched={formik.touched.icon}
                        placeholder="Enter icon class (e.g., fa-solid fa-box)"
                    />

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-main text-white py-3 rounded-md font-medium hover:bg-main/90 transition-colors"
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? 'Adding...' : 'Add Package'}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
