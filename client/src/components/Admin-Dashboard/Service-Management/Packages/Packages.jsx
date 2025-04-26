import React, { useReducer } from 'react';
import { DeletePackage, GetAllPackages } from '../../../../apis/services/services.api';
import usePriceFormat from '../../../../hooks/usePriceFormat';
import AddNewPackageModel from './Add-New-Package-Model/AddNewPackageModel';
import { motion, AnimatePresence } from 'framer-motion';
import Alert from '../../../shared/Alert/Alert';
import Loading from '../../../shared/Loading/Loading';
import Popup from '../../../shared/Popup/Popup';
import { produce } from 'immer';

const initialState = {
    showAddModal: false,
    showEditModal: false,
    selectedPackage: null,
    deleteMessage: null,
    deletedPackage: null,
};

function reducer(state, action) {
    return produce(state, draft => {
        switch (action.type) {
            case 'SHOW_ADD_MODAL':
                draft.showAddModal = true;
                break;
            case 'HIDE_ADD_MODAL':
                draft.showAddModal = false;
                break;
            case 'SHOW_EDIT_MODAL':
                draft.selectedPackage = action.payload;
                draft.showEditModal = true;
                break;
            case 'HIDE_EDIT_MODAL':
                draft.showEditModal = false;
                draft.selectedPackage = null;
                break;
            case 'SET_DELETED_PACKAGE':
                draft.deletedPackage = action.payload;
                break;
            case 'CLEAR_DELETED_PACKAGE':
                draft.deletedPackage = null;
                break;
            case 'SET_DELETE_MESSAGE':
                draft.deleteMessage = action.payload;
                break;
            case 'CLEAR_DELETE_MESSAGE':
                draft.deleteMessage = null;
                break;
            default:
                break;
        }
    });
}

export default function Packages() {
    const { data: packages, isLoading } = GetAllPackages();
    const { mutate: deletePackage } = DeletePackage();
    const formatPrice = usePriceFormat();
    const [state, dispatch] = useReducer(reducer, initialState);

    if (isLoading) return <Loading />;

    const handleEdit = (pkg) => {
        dispatch({ type: 'SHOW_EDIT_MODAL', payload: pkg });
    };

    const handleDelete = (pkg) => {
        dispatch({ type: 'SET_DELETED_PACKAGE', payload: pkg });
    };

    const confirmDelete = () => {
        if (!state.deletedPackage) return;
        deletePackage(state.deletedPackage._id, {
            onSuccess: (response) => {
                dispatch({ type: 'SET_DELETE_MESSAGE', payload: response.message });
                dispatch({ type: 'CLEAR_DELETED_PACKAGE' });
                setTimeout(() => {
                    dispatch({ type: 'CLEAR_DELETE_MESSAGE' });
                }, 1000);
            },
            onError: (error) => {
                console.error('Error deleting package:', error);
            }
        });
    };

    function PriceCard({ title, price, saving }) {
        return (
            <div className="bg-gray-50 p-3 rounded-lg">
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
                    onClick={() => dispatch({ type: 'SHOW_ADD_MODAL' })}
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
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{pkg.name}</h3>
                                <p className="text-sm text-gray-600">{pkg.description}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-4">
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
                                    onClick={() => handleDelete(pkg)}
                                    className="text-red-600 hover:bg-red-50 p-2 rounded-full"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals and Alerts */}
            <AnimatePresence>
                {state.deleteMessage && <Alert type="success">{state.deleteMessage}</Alert>}

                {state.deletedPackage && (
                    <Popup>
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-4">Are you sure you want to delete this Package?</p>
                        <p className="text-red-500 text-center mb-6"><strong>{state.deletedPackage.name}</strong></p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => dispatch({ type: 'CLEAR_DELETED_PACKAGE' })}
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

            {state.showAddModal && (
                <AnimatePresence>
                    <motion.div
                        className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 px-4 overflow-y-scroll"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <AddNewPackageModel closeModel={() => dispatch({ type: 'HIDE_ADD_MODAL' })} />
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Future: EditPackage Modal */}
            {/* {state.showEditModal && <EditPackageModal package={state.selectedPackage} onClose={() => dispatch({ type: 'HIDE_EDIT_MODAL' })} />} */}
        </div>
    );
}
