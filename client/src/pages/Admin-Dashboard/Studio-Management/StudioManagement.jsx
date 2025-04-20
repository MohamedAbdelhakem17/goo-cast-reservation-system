import React from 'react';
import useGetAllStudios from '../../../apis/studios/studios.api';

const StudioManagement = () => {
    const { data: studiosData, isLoading } = useGetAllStudios();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Studio Management</h1>
                <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors">
                    <i className="fa-solid fa-plus mr-2"></i>
                    Add New Studio
                </button>
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
                                    <div className="text-sm text-gray-900">{studio.pricePerHour} EGP</div>
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
                                        onClick={() => console.log('Edit:', studio._id)}
                                    >
                                        <i className="fa-solid fa-edit"></i>
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-900"
                                        onClick={() => console.log('Delete:', studio._id)}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudioManagement;