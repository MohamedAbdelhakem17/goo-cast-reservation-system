import React, { useReducer } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '../../../../shared/Input/Input';
import Alert from '../../../../shared/Alert/Alert';
import { AddNewPackage, GetAllCategories } from '../../../../../apis/services/services.api';
import { produce } from 'immer';
import Textarea from '../../../../shared/Textarea/Textarea';
import SelectInput from '../../../../shared/Select-Input/SelectInput';
import { useToast } from '../../../../../context/Toaster-Context/ToasterContext';

// Reducer actions
const ACTIONS = {
    SET_Target_Audience: 'SET_Target_Audience',
    ADD_Target_Audience: 'ADD_Target_Audience',
    REMOVE_Target_Audience: 'REMOVE_Target_Audience',
    SET_Post_Session_Benefits: 'SET_Post_Session_Benefits',
    ADD_Post_Session_Benefits: 'ADD_Post_Session_Benefits',
    REMOVE_Post_Session_Benefits: 'REMOVE_Post_Session_Benefits',
    SET_DETAIL: 'SET_DETAIL',
    ADD_DETAIL: 'ADD_DETAIL',
    REMOVE_DETAIL: 'REMOVE_DETAIL',
    SHOW_SUCCESS: 'SHOW_SUCCESS',
    SHOW_ERROR: 'SHOW_ERROR',
    HIDE_ALERTS: 'HIDE_ALERTS',
};

// Initial state
const initialState = {
    currentDetail: '',
    currentTargetAudience: '',
    currentPostSessionBenefits: '',
    showSuccessAlert: false,
    showErrorAlert: false,
    errorMessage: '',
};

// Reducer with Immer
function reducer(state, action) {
    return produce(state, draft => {
        switch (action.type) {
            case ACTIONS.SET_Target_Audience:
                draft.currentTargetAudience = action.payload;
                break;
            case ACTIONS.ADD_Target_Audience:
                draft.currentTargetAudience = '';
                break;
            case ACTIONS.REMOVE_Target_Audience:
                break;
            case ACTIONS.SET_Post_Session_Benefits:
                draft.currentPostSessionBenefits = action.payload;
                break;
            case ACTIONS.ADD_Post_Session_Benefits:
                draft.currentPostSessionBenefits = '';
                break;
            case ACTIONS.REMOVE_Post_Session_Benefits:
                break;
            case ACTIONS.SET_DETAIL:
                draft.currentDetail = action.payload;
                break;
            case ACTIONS.ADD_DETAIL:
                draft.currentDetail = '';
                break;
            case ACTIONS.REMOVE_DETAIL:
                break;
            case ACTIONS.SHOW_SUCCESS:
                draft.showSuccessAlert = true;
                break;
            case ACTIONS.SHOW_ERROR:
                draft.showErrorAlert = true;
                draft.errorMessage = action.payload;
                break;
            case ACTIONS.HIDE_ALERTS:
                draft.showSuccessAlert = false;
                draft.showErrorAlert = false;
                draft.errorMessage = '';
                break;
            default:
                break;
        }
    });
}

// Validation schema
const validationSchema = Yup.object({
    name: Yup.string().required('Package name is required').min(3, 'Name must be at least 3 characters'),
    description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    details: Yup.array().of(Yup.string().required('Detail is required')).min(1, 'At least one detail is required'),
    // prices: Yup.object({
    //     twoHours: Yup.number().required('Two hours price is required').min(0, 'Price must be a positive number'),
    //     halfDay: Yup.number().required('Half day price is required').min(0, 'Price must be a positive number'),
    //     fullDay: Yup.number().required('Full day price is required').min(0, 'Price must be a positive number'),
    // }),
    // savings: Yup.object({
    //     halfDay: Yup.number().required('Half day saving is required').min(0, 'Saving must be a positive number'),
    //     fullDay: Yup.number().required('Full day saving is required').min(0, 'Saving must be a positive number'),
    // }),
});

export default function AddNewPackageModel({ closeModel }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { currentDetail, showSuccessAlert, showErrorAlert, errorMessage, currentTargetAudience, currentPostSessionBenefits } = state;
    const { data: packagesCategories } = GetAllCategories();

    const { mutate: addPackage } = AddNewPackage();
    const { addToast } = useToast()
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            details: [],
            category: '',
            post_session_benefits: [],
            target_audience: [],
        },
        validationSchema,
        onSubmit:  (values) => {
             addPackage({
                ...values,
            }, {
                onSuccess: (response) => {
                    addToast(response.message || 'Package added successfully', 'success');
                    setTimeout(() => {
                        closeModel();
                    }, 2000);
                },
                onError: (error) => {
                    addToast(error.response.data.message || 'Something went wrong', 'error');
                }
            });
        },
    });

    // Details
    const handleAddDetail = () => {
        if (currentDetail.trim()) {
            formik.setFieldValue('details', [...formik.values.details, currentDetail.trim()]);
            dispatch({ type: ACTIONS.ADD_DETAIL });
        }
    };

    const handleRemoveDetail = (index) => {
        const updatedDetails = formik.values.details.filter((_, i) => i !== index);
        formik.setFieldValue('details', updatedDetails);
    };

    // Target Audience
    const handleAddTargetAudience = () => {
        if (currentTargetAudience.trim()) {
            formik.setFieldValue('target_audience', [...formik.values.target_audience, currentTargetAudience.trim()]);
            dispatch({ type: ACTIONS.ADD_Target_Audience });
        }
    };

    const handleRemoveTargetAudience = (index) => {
        const updateTargetAudience = formik.values.target_audience.filter((_, i) => i !== index);
        formik.setFieldValue('target_audience', updateTargetAudience);
    };

    // Target Post Session Benefits
    const handleAddPostSessionBenefits = () => {
        if (currentPostSessionBenefits.trim()) {
            formik.setFieldValue('post_session_benefits', [...formik.values.post_session_benefits, currentPostSessionBenefits.trim()]);
            dispatch({ type: ACTIONS.ADD_Post_Session_Benefits });
        }
    };

    const handleRemovePostSessionBenefits = (index) => {
        const updatePostSessionBenefits = formik.values.post_session_benefits.filter((_, i) => i !== index);
        formik.setFieldValue('post_session_benefits', updatePostSessionBenefits);
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

                    <SelectInput
                        placeholder='Select package category'
                        options={packagesCategories?.data?.map((category) => ({ value: category._id, label: category.name }))}
                        onChange={(e) => formik.setFieldValue('category', e.target.value)}

                    />

                    <Textarea
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
                                onChange={(e) => dispatch({ type: ACTIONS.SET_DETAIL, payload: e.target.value })}
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

                    {/* Target Audience */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                        <div className="flex gap-2 items-center">
                            <Input
                                value={currentTargetAudience}
                                onChange={(e) => dispatch({ type: ACTIONS.SET_Target_Audience, payload: e.target.value })}
                                placeholder="Enter Target Audience"
                                className="flex-1"
                            />
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddTargetAudience}
                                className="px-4 py-2 bg-main text-white rounded-md hover:bg-main/90"
                            >
                                Add
                            </motion.button>
                        </div>

                        {formik.touched.target_audience && formik.errors.target_audience && (
                            <div className="text-red-500 text-sm">{formik.errors.target_audience}</div>
                        )}

                        <ul className="space-y-2">
                            {formik.values.target_audience.map((target, index) => (
                                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <span>{target}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTargetAudience(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Post Session Benefits */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Post Session Benefits</label>
                        <div className="flex gap-2 items-center">
                            <Input
                                value={currentPostSessionBenefits}
                                onChange={(e) => dispatch({ type: ACTIONS.SET_Post_Session_Benefits, payload: e.target.value })}
                                placeholder="Enter Post Session Benefits"
                                className="flex-1"
                            />
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddPostSessionBenefits}
                                className="px-4 py-2 bg-main text-white rounded-md hover:bg-main/90"
                            >
                                Add
                            </motion.button>
                        </div>

                        {formik.touched.post_session_benefits && formik.errors.post_session_benefits && (
                            <div className="text-red-500 text-sm">{formik.errors.post_session_benefits}</div>
                        )}

                        <ul className="space-y-2">
                            {formik.values.post_session_benefits.map((item, index) => (
                                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <span>{item}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePostSessionBenefits(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>



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



{/* Prices & Savings */ }
{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

   
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
</div> */}