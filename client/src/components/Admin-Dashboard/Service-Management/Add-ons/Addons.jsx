import React from 'react'
import { GetAllAddOns } from '../../../../apis/services/services.api';

export default function Addons() {
    const { data: addons, isLoading } = GetAllAddOns();
    const TABLE_HEADERS = ['Name', 'Description', 'Price', 'Icon', 'Actions'];
    if (isLoading) return (<div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div></div>);

    const handleEdit = (id) => {
        // TODO: Implement edit functionality
        alert('Edit addon:', id);
    };

    const handleDelete = (id) => {
        // TODO: Implement delete functionality
        alert('Delete addon:', id);
    };

    const handleAdd = () => {
        // TODO: Implement add functionality
       alert('Add new addon');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-EG', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 0
        }).format(price);
    };
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Service Add-ons</h2>
                <button
                    onClick={handleAdd}
                    className="bg-main text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Add New Add-on
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            {
                                TABLE_HEADERS.map((header, index) => (
                                    <th
                                        key={index}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {addons?.data?.map((addon) => (
                            <tr key={addon._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{addon.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-500 max-w-md">{addon.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{formatPrice(addon.price)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <i className={`fas ${addon.icon} text-gray-600`}></i>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(addon._id)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(addon._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete 
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
