import React, { useState } from 'react';
import useGetAllStudios, { DeleteStudio } from '../../../apis/studios/studios.api';
import { motion, AnimatePresence } from 'framer-motion';
import Alert from '../../../components/shared/Alert/Alert';
import Popup from '../../../components/shared/Popup/Popup';
import Loading from '../../../components/shared/Loading/Loading';
import { Link, useNavigate } from 'react-router-dom';
import usePriceFormat from '../../../hooks/usePriceFormat';

const StudioManagement = () => {
    const { data: studiosData, isLoading } = useGetAllStudios();
    const { mutate: deleteStudio } = DeleteStudio();
    const priceFormat = usePriceFormat();
    const navigate = useNavigate();

    const [selectedStudio, setSelectedStudio] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleDelete = (studio) => {
        setSelectedStudio(studio);
    };

    const handleEdit = (studioId) => {
        navigate(`/admin-dashboard/studio-management/add?edit=${studioId}`);
    };

    const confirmDelete = () => {
        deleteStudio(selectedStudio._id, {
            onSuccess: () => {
                setSelectedStudio(null);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 1000);
            }
        });
    };

    if (isLoading) return <Loading />

    return (
        <div className="p-6">
            {showSuccess && (<Alert type="success">Studio deleted successfully.</Alert>)}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Studio Management</h1>
                <Link to="/admin-dashboard/studio-management/add" className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors">
                    <i className="fa-solid fa-plus mr-2"></i>
                    Add New Studio
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price per Hour</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {studiosData?.data.map((studio) => (
                            <tr key={studio._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img
                                        src={studio.thumbnail}
                                        alt={studio.name}
                                        className="h-10 w-10 rounded-lg object-cover"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{studio.name}</div>
                                    <div className="text-sm text-gray-500">{studio.address}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{priceFormat(studio.pricePerHour || studio.basePricePerSlot)} </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        <span className="text-yellow-500 mr-1">
                                            <i className="fa-solid fa-star"></i>
                                        </span>
                                        {studio.ratingAverage} ({studio.ratingQuantity})
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        onClick={() => handleEdit(studio._id)}
                                    >
                                        <i className="fa-solid fa-edit"></i>
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-900"
                                        onClick={() => handleDelete(studio)}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence mode='wait'>
                {selectedStudio && (
                    <Popup>
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-4">Are you sure you want to delete this studio?</p>
                        <p className="text-red-500 text-center mb-6"><strong>{selectedStudio.name}</strong></p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedStudio(null)}
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
                )}

            </AnimatePresence>
        </div>
    );
};

export default StudioManagement;