import React, { useReducer } from "react";
import {
    DeletePackage,
    GetAllCategories,
    GetAllPackages,
    UpdatePackage,
} from "../../../../apis/services/services.api";
import AddNewPackageModel from "./Add-New-Package-Model/AddNewPackageModel";
import { motion, AnimatePresence } from "framer-motion";
import Alert from "../../../shared/Alert/Alert";
import Loading from "../../../shared/Loading/Loading";
import Popup from "../../../shared/Popup/Popup";
import Input from "../../../shared/Input/Input";
import { produce } from "immer";
import Textarea from "../../../shared/Textarea/Textarea";
import SelectInput from "../../../shared/Select-Input/SelectInput";

const initialState = {
    showAddModal: false,
    showEditModal: false,
    selectedPackage: null,
    deleteMessage: null,
    deletedPackage: null,
    editingPackage: null,
};

function reducer(state, action) {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SHOW_ADD_MODAL":
                draft.showAddModal = true;
                break;
            case "HIDE_ADD_MODAL":
                draft.showAddModal = false;
                break;
            case "SET_EDITING_PACKAGE":
                draft.editingPackage = { ...action.payload };
                break;
            case "CLEAR_EDITING_PACKAGE":
                draft.editingPackage = null;
                break;
            case "UPDATE_FIELD":
                { const { field, value } = action.payload;
                if (field.includes(".")) {
                    const [parent, child] = field.split(".");
                    draft.editingPackage[parent][child] = value;
                } else {
                    draft.editingPackage[field] = value;
                }
                break; }
            case "SET_DELETED_PACKAGE":
                draft.deletedPackage = action.payload;
                break;
            case "CLEAR_DELETED_PACKAGE":
                draft.deletedPackage = null;
                break;
            case "SET_DELETE_MESSAGE":
                draft.deleteMessage = action.payload;
                break;
            case "CLEAR_DELETE_MESSAGE":
                draft.deleteMessage = null;
                break;
            default:
                break;
        }
    });
}

const EditableList = ({ items, onChange, placeholder }) => (
    <div className="space-y-3 mt-3">
        <div className="text-sm font-medium text-gray-700 mb-1">{placeholder}s</div>
        {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
                <Input
                    className="flex-1"
                    value={item}
                    onChange={(e) => onChange(index, e.target.value)}
                    placeholder={placeholder}
                />
                <button
                    onClick={() => onChange(index, null)}
                    className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors"
                >
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        ))}
        <button 
            onClick={() => onChange(items.length, "")} 
            className="text-main hover:text-main/90 flex items-center gap-1 text-sm font-medium mt-1 bg-main/5 hover:bg-main/10 px-3 py-1.5 rounded-md transition-colors"
        >
            <i className="fa-solid fa-plus text-xs"></i> Add {placeholder}
        </button>
    </div>
);

export default function Packages() {
    const { data: packages, isLoading } = GetAllPackages();
    const { data: packagesCategories } = GetAllCategories();
    const { mutate: deletePackage } = DeletePackage();
    const { mutate: updatePackage } = UpdatePackage();
    const [state, dispatch] = useReducer(reducer, initialState);

    if (isLoading) return <Loading />;

    const handleEdit = (pkg) => dispatch({ type: "SET_EDITING_PACKAGE", payload: pkg });
    const handleCancelEdit = () => dispatch({ type: "CLEAR_EDITING_PACKAGE" });

    const handleSave = () => {
        if (!state.editingPackage) return;
        updatePackage(
            {
                id: state.editingPackage._id,
                data: state.editingPackage,
            },
            {
                onSuccess: () => dispatch({ type: "CLEAR_EDITING_PACKAGE" }),
                onError: (error) => console.error("Update error:", error),
            }
        );
    };

    const handleDelete = (pkg) => dispatch({ type: "SET_DELETED_PACKAGE", payload: pkg });

    const confirmDelete = () => {
        if (!state.deletedPackage) return;
        deletePackage(state.deletedPackage._id, {
            onSuccess: (res) => {
                dispatch({ type: "SET_DELETE_MESSAGE", payload: res.message });
                dispatch({ type: "CLEAR_DELETED_PACKAGE" });
                setTimeout(() => dispatch({ type: "CLEAR_DELETE_MESSAGE" }), 2000);
            },
            onError: (err) => console.error("Delete error:", err),
        });
    };

    const updateField = (field, value) => dispatch({ type: "UPDATE_FIELD", payload: { field, value } });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <i className="fa-solid fa-box-open text-main mr-3"></i>
                    Service Packages
                </h2>
                <button
                    onClick={() => dispatch({ type: "SHOW_ADD_MODAL" })}
                    className="bg-main text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-main/90 shadow-sm hover:shadow transition-all font-medium"
                >
                    <i className="fa-solid fa-plus"></i> Add New Package
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages?.data.map((pkg) => {
                    const isEditing = state.editingPackage?._id === pkg._id;
                    const current = isEditing ? state.editingPackage : pkg;

                    return (
                        <motion.div
                            key={pkg._id}
                            className={`bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-all ${isEditing ? 'ring-2 ring-main/30' : 'hover:shadow-xl'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-gradient-to-r from-main/10 to-main/5 px-6 py-4 ">
                                {isEditing ? (
                                    <Input
                                        label="Name"
                                        value={current.name}
                                        onChange={(e) => updateField("name", e.target.value)}
                                        className="mb-0"
                                    />
                                ) : (
                                    <h3 className="text-xl font-semibold text-gray-800">{pkg.name}</h3>
                                )}
                            </div>
                            
                            <div className="p-6 flex-grow">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <Input
                                            label="Description"
                                            value={current.description}
                                            onChange={(e) => updateField("description", e.target.value)}
                                        />
                                        <SelectInput
                                            label="Category"
                                            value={current.category.name}
                                            options={packagesCategories?.data.map(c => ({ value: c._id, label: c.name }))}
                                            onChange={(e) => updateField("category.name", e.target.value)}
                                        />
                                        <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border">
                                            <input
                                                type="checkbox"
                                                checked={current.isFixed}
                                                onChange={(e) => updateField("isFixed", e.target.checked)}
                                                className="w-4 h-4 accent-main"
                                            />
                                            <span className="text-sm font-medium">Fixed Price Package</span>
                                        </label>

                                        <EditableList
                                            items={current.target_audience}
                                            onChange={(i, val) => {
                                                const updated = [...current.target_audience];
                                                if (val === null) updated.splice(i, 1);
                                                else updated[i] = val;
                                                updateField("target_audience", updated);
                                            }}
                                            placeholder="Target Audience"
                                        />

                                        <EditableList
                                            items={current.details}
                                            onChange={(i, val) => {
                                                const updated = [...current.details];
                                                if (val === null) updated.splice(i, 1);
                                                else updated[i] = val;
                                                updateField("details", updated);
                                            }}
                                            placeholder="Package Detail"
                                        />

                                        <EditableList
                                            items={current.post_session_benefits}
                                            onChange={(i, val) => {
                                                const updated = [...current.post_session_benefits];
                                                if (val === null) updated.splice(i, 1);
                                                else updated[i] = val;
                                                updateField("post_session_benefits", updated);
                                            }}
                                            placeholder="Post-session Benefit"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                                        <div className="flex gap-2 mb-5">
                                            <span className="bg-main/10 text-main px-3 py-1 rounded-full text-xs font-medium">{pkg.category.name}</span>
                                            {pkg.isFixed && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Fixed Price</span>}
                                        </div>
                                        
                                        {pkg.target_audience.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                    <i className="fa-solid fa-users text-main/70 mr-2"></i> Target Audience
                                                </h4>
                                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-1">
                                                    {pkg.target_audience.map((a, i) => <li key={i}>{a}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {pkg.details.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                    <i className="fa-solid fa-list-check text-main/70 mr-2"></i> Package Details
                                                </h4>
                                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-1">
                                                    {pkg.details.map((d, i) => <li key={i}>{d}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {pkg.post_session_benefits.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                    <i className="fa-solid fa-gift text-main/70 mr-2"></i> Post-session Benefits
                                                </h4>
                                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-1">
                                                    {pkg.post_session_benefits.map((b, i) => <li key={i}>{b}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className={`flex justify-end gap-2 p-4 border-t border-main ${isEditing ? 'bg-gray-50' : ''}`}>
                                {isEditing ? (
                                    <>
                                        <button 
                                            onClick={handleSave} 
                                            className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
                                        >
                                            <i className="fa-solid fa-check"></i> Save
                                        </button>
                                        <button 
                                            onClick={handleCancelEdit} 
                                            className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
                                        >
                                            <i className="fa-solid fa-times"></i> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => handleEdit(pkg)} 
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg flex items-center gap-1 transition-colors"
                                        >
                                            <i className="fa-solid fa-edit"></i> Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(pkg)} 
                                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg flex items-center gap-1 transition-colors"
                                        >
                                            <i className="fa-solid fa-trash"></i> Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {packages?.data.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="text-gray-400 text-5xl mb-4">
                        <i className="fa-solid fa-box-open"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Packages Found</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first service package</p>
                    <button
                        onClick={() => dispatch({ type: "SHOW_ADD_MODAL" })}
                        className="bg-main text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-main/90"
                    >
                        <i className="fa-solid fa-plus"></i> Add New Package
                    </button>
                </div>
            )}

            <AnimatePresence>
                {state.deleteMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-4 right-4 z-50"
                    >
                        <Alert type="success">{state.deleteMessage}</Alert>
                    </motion.div>
                )}

                {state.deletedPackage && (
                    <Popup>
                        <div className="text-center mb-2">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 text-2xl mb-4">
                                <i className="fa-solid fa-trash"></i>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-4 text-center">Confirm Delete</h3>
                        <p className="mb-4 text-center text-gray-600">Are you sure you want to delete this package?</p>
                        <p className="text-red-500 text-center mb-6 font-bold bg-red-50 py-2 rounded-lg">{state.deletedPackage.name}</p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => dispatch({ type: "CLEAR_DELETED_PACKAGE" })}
                                className="px-5 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors flex items-center gap-2"
                            >
                                <i className="fa-solid fa-trash"></i> Delete
                            </button>
                        </div>
                    </Popup>
                )}
            </AnimatePresence>

            {state.showAddModal && (
                <AnimatePresence>
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4 overflow-y-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                            <AddNewPackageModel closeModel={() => dispatch({ type: "HIDE_ADD_MODAL" })} />
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}