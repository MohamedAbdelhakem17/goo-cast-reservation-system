import { useState } from 'react';
import { Editor } from 'primereact/editor';
import Input from '../../../../components/shared/Input/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AddNewStudio from '../../../../apis/studios/Add.Studio.Api';
import Alert from '../../../../components/shared/Alert/Alert';

export default function AddStudio() {
    const navigate = useNavigate();
    const { formik, isLoading } = AddNewStudio(); // تأكد أن handleSubmit مضمّن في الهوك
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [facilities, setFacilities] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [images, setImages] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [currentFacility, setCurrentFacility] = useState('');
    const [currentEquipment, setCurrentEquipment] = useState('');

    const handleAddFacility = () => {
        if (currentFacility.trim()) {
            const updated = [...facilities, currentFacility];
            setFacilities(updated);
            formik.setFieldValue('facilities', updated);
            setCurrentFacility('');
        }
    };

    const handleRemoveFacility = (index) => {
        const updated = facilities.filter((_, i) => i !== index);
        setFacilities(updated);
        formik.setFieldValue('facilities', updated);
    };

    const handleAddEquipment = () => {
        if (currentEquipment.trim()) {
            const updated = [...equipment, currentEquipment];
            setEquipment(updated);
            formik.setFieldValue('equipment', updated);
            setCurrentEquipment('');
        }
    };

    const handleRemoveEquipment = (index) => {
        const updated = equipment.filter((_, i) => i !== index);
        setEquipment(updated);
        formik.setFieldValue('equipment', updated);
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            formik.setFieldValue('thumbnail', file);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) return;
        setImages(files);
        formik.setFieldValue('imagesGallery', files);
    };

    console.log(!formik.isValid, "Formik Valid");
    console.log(formik.errors, "Formik Errors");
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto p-8">
            <AnimatePresence>
                {error && <Alert type="error">{error}</Alert>}
                {success && <Alert type="success">Studio added successfully!</Alert>}
            </AnimatePresence>

            <div className="p-8">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4 rounded-md border-main text-center">
                    Add New Studio
                </h2>

                <form onSubmit={formik.handleSubmit} className="space-y-8">
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

                    {/* Facilities Input */}
                    <div className="bg-gray-50 rounded-lg p-4 w-full">
                        <label className="block text-sm font-medium mb-4 text-gray-700">Facilities</label>
                        <div className="flex gap-5 mb-2 w-full items-center">
                            <Input
                                value={currentFacility}
                                onChange={(e) => setCurrentFacility(e.target.value)}
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
                            {facilities.map((facility, index) => (
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

                    {/* Equipment Input */}
                    <div className="bg-gray-50 rounded-lg p-4 w-full">
                        <label className="block text-sm font-medium mb-4 text-gray-700">Equipment</label>
                        <div className="flex gap-5 mb-2 w-full items-center">
                            <Input
                                value={currentEquipment}
                                onChange={(e) => setCurrentEquipment(e.target.value)}
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
                            {equipment.map((item, index) => (
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

                    {/* Studio Hours */}
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

                        {/* Image Uploads */}
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

                    <motion.button
                        type="submit"
                        disabled={!formik.isValid}
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
