import { useReducer } from 'react'
import { produce } from 'immer'
import { AnimatePresence, motion } from 'framer-motion'
import { DeleteAddOn, GetAllAddOns, UpdateAddOn } from '../../../../apis/services/services.api'
import AddNewAddOnModel from './Add-New-Add-On-Model/AddNewAddOnModel'
import usePriceFormat from '../../../../hooks/usePriceFormat'
import Input from '../../../shared/Input/Input'
import Popup from '../../../shared/Popup/Popup'
import { useToast } from '../../../../context/Toaster-Context/ToasterContext'

// Initial State
const initialState = {
    addNewAddOn: false,
    deletedAddon: null,
    editingId: null,
    editFormData: {
        name: '',
        description: '',
        image: null,
        price: 0
    }
}

// Actions
const actions = {
    START_EDIT: 'START_EDIT',
    CANCEL_EDIT: 'CANCEL_EDIT',
    UPDATE_EDIT_FORM: 'UPDATE_EDIT_FORM',
    OPEN_ADD_NEW: 'OPEN_ADD_NEW',
    CLOSE_ADD_NEW: 'CLOSE_ADD_NEW',
    SET_DELETE_ADDON: 'SET_DELETE_ADDON',
    CLEAR_DELETE_ADDON: 'CLEAR_DELETE_ADDON',
    UPDATE_IMAGE: 'UPDATE_IMAGE', // Action for image update
}

// Reducer
function reducer(state, action) {
    return produce(state, draft => {
        switch (action.type) {
            case actions.START_EDIT:
                draft.editingId = action.payload._id
                draft.editFormData = {
                    name: action.payload.name,
                    description: action.payload.description,
                    image: action.payload.image,
                    price: action.payload.price
                }
                break
            case actions.CANCEL_EDIT:
                draft.editingId = null
                draft.editFormData = { name: '', description: '', image: null, price: 0 }
                break
            case actions.UPDATE_EDIT_FORM:
                draft.editFormData[action.payload.field] = action.payload.value
                break
            case actions.OPEN_ADD_NEW:
                draft.addNewAddOn = true
                break
            case actions.CLOSE_ADD_NEW:
                draft.addNewAddOn = false
                break
            case actions.SET_DELETE_ADDON:
                draft.deletedAddon = action.payload
                break
            case actions.CLEAR_DELETE_ADDON:
                draft.deletedAddon = null
                break
            case actions.UPDATE_IMAGE:
                draft.editFormData.image = action.payload
                break
            default:
                break
        }
    })
}

// Component
export default function Addons() {
    const { data: addons, isLoading } = GetAllAddOns()
    const { mutate: deleteAddOn } = DeleteAddOn()
    const { mutate: updateAddOn } = UpdateAddOn()
    const { addToast } = useToast()
    const formatPrice = usePriceFormat()

    const [state, dispatch] = useReducer(reducer, initialState)

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
            </div>
        )
    }

    const handleEdit = (addon) => {
        dispatch({ type: actions.START_EDIT, payload: addon })
    }

    const handleUpdate = () => {
        updateAddOn({
            id: state.editingId,
            data: state.editFormData
        }, {
            onSuccess: (response) => {
                addToast(response.message, 'success')
                dispatch({ type: actions.CANCEL_EDIT })
            },
            onError: (error) => {
                addToast(error.response?.data?.message || 'Something went wrong', 'error')
                console.error('Error updating add-on:', error)
            }
        })
    }

    const handleDelete = (addon) => {
        dispatch({ type: actions.SET_DELETE_ADDON, payload: addon })
    }

    const confirmDelete = () => {
        deleteAddOn(state.deletedAddon._id, {
            onSuccess: (response) => {
                addToast(response.message, 'success')
                dispatch({ type: actions.CLEAR_DELETE_ADDON })
            },
            onError: (error) => {
                console.error('Error deleting add-on:', error)
            }
        })
    }

    const handleAdd = () => {
        dispatch({ type: actions.OPEN_ADD_NEW })
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            dispatch({ type: actions.UPDATE_IMAGE, payload: file })
        }
    }

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
                            {['Name', 'Description', 'Price', 'Image', 'Actions'].map((header, index) => (
                                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {addons?.data?.map((addon) => (
                            <tr key={addon._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {state.editingId === addon._id ? (
                                        <Input
                                            value={state.editFormData.name}
                                            onChange={(e) => dispatch({ type: actions.UPDATE_EDIT_FORM, payload: { field: 'name', value: e.target.value } })}
                                            placeholder="Enter name"
                                        />
                                    ) : (
                                        <div className="text-sm font-medium text-gray-900">{addon.name}</div>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    {state.editingId === addon._id ? (
                                        <Input
                                            value={state.editFormData.description}
                                            onChange={(e) => dispatch({ type: actions.UPDATE_EDIT_FORM, payload: { field: 'description', value: e.target.value } })}
                                            placeholder="Enter description"
                                        />
                                    ) : (
                                        <div className="text-sm text-gray-500 max-w-md">{addon.description}</div>
                                    )}
                                </td>
                                {/* 
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{formatPrice(addon.price)}</div>
                                </td> */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {state.editingId === addon._id ? (
                                        <Input
                                            type="number"
                                            value={state.editFormData.price}
                                            onChange={(e) =>
                                                dispatch({
                                                    type: actions.UPDATE_EDIT_FORM,
                                                    payload: { field: 'price', value: parseFloat(e.target.value) }
                                                })
                                            }
                                            placeholder="Enter price"
                                        />
                                    ) : (
                                        <div className="text-sm text-gray-900">{formatPrice(addon.price)}</div>
                                    )}
                                </td>


                                <td className="px-6 py-4 whitespace-nowrap">
                                    {state.editingId === addon._id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                onChange={handleImageUpload}
                                                className="cursor-pointer"
                                            />
                                            {state.editFormData.image && state.editFormData.image instanceof File && (
                                                <img
                                                    src={URL.createObjectURL(state.editFormData.image)}
                                                    alt="Addon"
                                                    className="w-14 h-14 rounded-full"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <img src={addon.image} alt="Addon" className="w-14 h-14 rounded-full" />
                                    )}
                                </td>


                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {state.editingId === addon._id ? (
                                        <>
                                            <button
                                                onClick={handleUpdate}
                                                className="text-green-600 hover:text-green-900 mr-4"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => dispatch({ type: actions.CANCEL_EDIT })}
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
                                                onClick={() => handleDelete(addon)}
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

            <AnimatePresence>
                {state.deletedAddon && (
                    <Popup>
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-4">Are you sure you want to delete this Add-on?</p>
                        <p className="text-red-500 text-center mb-6"><strong>{state.deletedAddon.name}</strong></p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => dispatch({ type: actions.CLEAR_DELETE_ADDON })}
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

                {state.addNewAddOn && (
                    <motion.div
                        className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <AddNewAddOnModel closeModel={() => dispatch({ type: actions.CLOSE_ADD_NEW })} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
