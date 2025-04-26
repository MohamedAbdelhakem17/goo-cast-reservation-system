import { useReducer } from 'react';
import { Editor } from 'primereact/editor';
import Input from '../../../../components/shared/Input/Input';
import { motion, AnimatePresence } from 'framer-motion';
import AddNewStudio from '../../../../apis/studios/Add.Studio.Api';
import Alert from '../../../../components/shared/Alert/Alert';
import { produce } from 'immer';

const initialState = {
    facilities: [],
    equipment: [],
    images: [],
    thumbnail: null,
    currentFacility: '',
    currentEquipment: '',
    error: '',
    success: false,
};

function reducer(state, action) {
    return produce(state, draft => {
        switch (action.type) {
            case 'SET_ERROR':
                draft.error = action.payload;
                break;
            case 'SET_SUCCESS':
                draft.success = action.payload;
                break;
            case 'SET_CURRENT_FACILITY':
                draft.currentFacility = action.payload;
                break;
            case 'SET_CURRENT_EQUIPMENT':
                draft.currentEquipment = action.payload;
                break;
            case 'ADD_FACILITY':
                draft.facilities.push(draft.currentFacility);
                draft.currentFacility = '';
                break;
            case 'REMOVE_FACILITY':
                draft.facilities.splice(action.payload, 1);
                break;
            case 'ADD_EQUIPMENT':
                draft.equipment.push(draft.currentEquipment);
                draft.currentEquipment = '';
                break;
            case 'REMOVE_EQUIPMENT':
                draft.equipment.splice(action.payload, 1);
                break;
            case 'SET_THUMBNAIL':
                draft.thumbnail = action.payload;
                break;
            case 'SET_IMAGES':
                draft.images = action.payload;
                break;
            default:
                break;
        }
    });
}

export default function AddStudio() {
    const { formik, isLoading } = AddNewStudio();

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleAddFacility = () => {
        if (state.currentFacility.trim()) {
            dispatch({ type: 'ADD_FACILITY' });
            formik.setFieldValue('facilities', [...state.facilities, state.currentFacility]);
        }
    };

    const handleRemoveFacility = (index) => {
        dispatch({ type: 'REMOVE_FACILITY', payload: index });
        const updated = state.facilities.filter((_, i) => i !== index);
        formik.setFieldValue('facilities', updated);
    };

    const handleAddEquipment = () => {
        if (state.currentEquipment.trim()) {
            dispatch({ type: 'ADD_EQUIPMENT' });
            formik.setFieldValue('equipment', [...state.equipment, state.currentEquipment]);
        }
    };

    const handleRemoveEquipment = (index) => {
        dispatch({ type: 'REMOVE_EQUIPMENT', payload: index });
        const updated = state.equipment.filter((_, i) => i !== index);
        formik.setFieldValue('equipment', updated);
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            dispatch({ type: 'SET_THUMBNAIL', payload: file });
            formik.setFieldValue('thumbnail', file);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) return;
        dispatch({ type: 'SET_IMAGES', payload: files });
        formik.setFieldValue('imagesGallery', files);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto p-8">

            <div className="p-8">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4 rounded-md border-main text-center">
                    Add New Studio
                </h2>

                <form onSubmit={(e)=>{
                    e.preventDefault();
                    formik.handleSubmit();
                }} className="space-y-8">
                    {/* Studio Basic Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            label="Studio Name"
                            id="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            errors={formik.errors.name}
                            touched={formik.touched.name}
                            placeholder="Enter studio name"
                        />

                        <Input
                            label="Address"
                            id="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            errors={formik.errors.address}
                            touched={formik.touched.address}
                            placeholder="Enter studio address"
                        />
                    </div>

                    {/* Price + Fixed Hourly */}
                    <div className="flex gap-6">
                        <Input
                            type="number"
                            label="Base Price Per Slot"
                            id="basePricePerSlot"
                            value={formik.values.basePricePerSlot}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            errors={formik.errors.basePricePerSlot}
                            touched={formik.touched.basePricePerSlot}
                            placeholder="Enter base price"
                            className="w-3/4"
                        />
                        <div className="flex items-center space-x-4 w-1/4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formik.values.isFixedHourly}
                                    onChange={() => formik.setFieldValue('isFixedHourly', !formik.values.isFixedHourly)}
                                    className="w-6 h-6 p-3 text-main rounded"
                                />
                                <span className="text-gray-700">Fixed Hourly Rate</span>
                            </label>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-md p-6">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
                        <Editor
                            value={formik.values.description}
                            onTextChange={(e) => formik.setFieldValue('description', e.htmlValue)}
                            style={{ height: '250px' }}
                        />
                        {formik.errors.description && formik.touched.description && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
                        )}
                    </div>

                    {/* Facilities */}
                    <div className="bg-gray-50 rounded-lg p-4 w-full">
                        <label className="block text-sm font-medium mb-4 text-gray-700">Facilities</label>
                        <div className="flex gap-5 mb-2 w-full items-center">
                            <Input
                                value={state.currentFacility}
                                onChange={(e) => dispatch({ type: 'SET_CURRENT_FACILITY', payload: e.target.value })}
                                placeholder="Enter facility"
                                className="w-full"
                            />
                            <button
                                type="button"
                                onClick={handleAddFacility}
                                className="p-4 bg-main text-white rounded-md hover:bg-main/70 transition"
                            >
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                            {state.facilities.map((facility, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white px-3 py-1 rounded-md border border-gray-300 flex items-center gap-2 group"
                                >
                                    <span className="text-sm">{facility}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFacility(index)}
                                        className="text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ×
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Equipment */}
                    <div className="bg-gray-50 rounded-lg p-4 w-full">
                        <label className="block text-sm font-medium mb-4 text-gray-700">Equipment</label>
                        <div className="flex gap-5 mb-2 w-full items-center">
                            <Input
                                value={state.currentEquipment}
                                onChange={(e) => dispatch({ type: 'SET_CURRENT_EQUIPMENT', payload: e.target.value })}
                                placeholder="Enter equipment"
                                className="w-full"
                            />
                            <button
                                type="button"
                                onClick={handleAddEquipment}
                                className="p-4 bg-main text-white rounded-md hover:bg-main/70 transition"
                            >
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                            {state.equipment.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white px-3 py-1 rounded-md border border-gray-300 flex items-center gap-2 group"
                                >
                                    <span className="text-sm">{item}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveEquipment(index)}
                                        className="text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ×
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Studio Hours + Images */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <label className="block text-sm font-medium mb-4 text-gray-700">Studio Hours</label>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm mb-2 text-gray-600">Start Time</label>
                                    <input
                                        type="time"
                                        value={formik.values.startTime}
                                        onChange={(e) => formik.setFieldValue('startTime', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-2 text-gray-600">End Time</label>
                                    <input
                                        type="time"
                                        value={formik.values.endTime}
                                        onChange={(e) => formik.setFieldValue('endTime', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6">
                            <label className="block text-sm font-medium mb-4 text-gray-700">Images</label>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm mb-2 text-gray-600">Thumbnail</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailUpload}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-2 text-gray-600">Gallery Images (Max 5)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        className="bg-main/70 text-white px-8 py-3 rounded-lg hover:bg-main transition disabled:opacity-50"
                        whileHover={{ scale: !isLoading ? 1.02 : 1 }}
                        whileTap={{ scale: !isLoading ? 0.98 : 1 }}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                                Adding Studio...
                            </div>
                        ) : (
                            'Add Studio'
                        )}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
