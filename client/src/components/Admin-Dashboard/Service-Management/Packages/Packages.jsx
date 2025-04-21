import React, { useState } from 'react';
import { GetAllPackages } from '../../../../apis/services/services.api';

export default function Packages() {
    const { data: packages, isLoading } = GetAllPackages();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    if (isLoading) return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
        </div>
    );

    const handleEdit = (pkg) => {
        setSelectedPackage(pkg);
        setShowEditModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            // TODO: Implement delete functionality
            console.log('Delete package:', id);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-EG', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 0
        }).format(price);
    };

    function PriceCard({ title, price, saving }) {
        return (
            <div className="bg-gray-50 p-3 rounded-lg ">
                <h4 className="text-sm font-medium text-gray-600">{title}</h4>
                <p className="text-lg font-bold text-gray-800">
                    {formatPrice(price)}
                </p>
                {saving > 0 && (
                    <p className="text-xs text-green-600">{formatPrice(saving)}</p>
                )}
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Service Packages</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-main text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-main/90"
                >
                    <i className="fa-solid fa-plus"></i>
                    Add New Package
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages?.data.map((pkg) => (
                    <div key={pkg._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-main/10 rounded-full flex items-center justify-center my-2">
                            <i className={`fa-solid ${pkg.icon} text-main text-xl`}></i>
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">{pkg.name}</h3>
                                    <p className="text-sm text-gray-600">{pkg.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid  gap-4">
                                <PriceCard title="2 Hours" price={pkg.prices.twoHours} saving={0} />
                                <PriceCard title="Half Day" price={pkg.prices.halfDay} saving={pkg.savings.halfDay} />
                                <PriceCard title="Full Day" price={pkg.prices.fullDay} saving={pkg.savings.fullDay} />
                            </div>

                            <div className="mt-4">
                                <h4 className="font-semibold mb-2">Package Includes:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {pkg.details.map((detail, index) => (
                                        <li key={index} className="text-sm text-gray-600">{detail}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => handleEdit(pkg)}
                                    className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"
                                >
                                    <i className="fa-solid fa-edit"></i>
                                </button>
                                <button
                                    onClick={() => handleDelete(pkg._id)}
                                    className="text-red-600 hover:bg-red-50 p-2 rounded-full"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* TODO: Add Modal Component */}
            {/* {showAddModal && <AddPackageModal onClose={() => setShowAddModal(false)} />} */}
            {/* {showEditModal && <EditPackageModal package={selectedPackage} onClose={() => setShowEditModal(false)} />} */}
        </div>
    );
}


