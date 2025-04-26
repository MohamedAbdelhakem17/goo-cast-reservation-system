import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DeleteAddOn, GetAllAddOns, UpdateAddOn } from '../../../../apis/services/services.api';
import AddNewAddOnModel from './Add-New-Add-On-Model/AddNewAddOnModel';
import usePriceFormat from '../../../../hooks/usePriceFormat';
import Alert from '../../../shared/Alert/Alert';
import Input from '../../../shared/Input/Input';

export default function Addons() {
    const { data: addons, isLoading } = GetAllAddOns();
    const { mutate: deleteAddOn } = DeleteAddOn();
    const { mutate: updateAddOn } = UpdateAddOn();
    const [addNewAddOn, setAddNewAddOn] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showUpdateAlert, setShowUpdateAlert] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        price: '',
        icon: ''
    });
    const TABLE_HEADERS = ['Name', 'Description', 'Price', 'Icon', 'Actions'];

    const formatPrice = usePriceFormat()

    if (isLoading) return (<div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div></div>);

    const handleEdit = (addon) => {
        setEditingId(addon._id);
        setEditFormData({
            name: addon.name,
            description: addon.description,
            price: addon.price,
            icon: addon.icon
        });
    };

    const handleUpdate = async () => {
        try {
            await updateAddOn({
                id: editingId,
                data: editFormData
            });
            setEditingId(null);
            setShowUpdateAlert(true);
            setTimeout(() => {
                setShowUpdateAlert(false);
            }, 3000);
        } catch (error) {
            console.error('Error updating add-on:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditFormData({
            name: '',
            description: '',
            price: '',
            icon: ''
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteAddOn(id);
            setShowDeleteAlert(true);
            setTimeout(() => {
                setShowDeleteAlert(false);
            }, 3000);
        } catch (error) {
            console.error('Error deleting add-on:', error);
        }
    };

    const handleAdd = () => {
        setAddNewAddOn(true);
    };

    return (
        <div className="p-6">
            <AnimatePresence>
                {showDeleteAlert && (
                    <Alert type="success">Add-on deleted successfully!</Alert>
                )}
                {showUpdateAlert && (
                    <Alert type="success">Add-on updated successfully!</Alert>
                )}
            </AnimatePresence>

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
                            {TABLE_HEADERS.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {addons?.data?.map((addon) => (
                            <tr key={addon._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingId === addon._id ? (
                                        <Input
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                            placeholder="Enter name"
                                        />
                                    ) : (
                                        <div className="text-sm font-medium text-gray-900">{addon.name}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === addon._id ? (
                                        <Input
                                            value={editFormData.description}
                                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                            placeholder="Enter description"
                                        />
                                    ) : (
                                        <div className="text-sm text-gray-500 max-w-md">{addon.description}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingId === addon._id ? (
                                        <Input
                                            type="number"
                                            value={editFormData.price}
                                            onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                                            placeholder="Enter price"
                                            min="0"
                                        />
                                    ) : (
                                        <div className="text-sm text-gray-900">{formatPrice(addon.price)}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingId === addon._id ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={editFormData.icon}
                                                onChange={(e) => setEditFormData({ ...editFormData, icon: e.target.value })}
                                                placeholder="fa-icon-name"
                                            />
                                            <i className={`fas ${editFormData.icon} text-gray-600`}></i>
                                        </div>
                                    ) : (
                                        <i className={`fas ${addon.icon} text-gray-600`}></i>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {editingId === addon._id ? (
                                        <>
                                            <button
                                                onClick={handleUpdate}
                                                className="text-green-600 hover:text-green-900 mr-4"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(addon)}
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
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {addNewAddOn && (
                <AnimatePresence>
                    <motion.div
                        className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <AddNewAddOnModel closeModel={() => setAddNewAddOn(false)} />
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
