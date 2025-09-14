import { useReducer } from "react";
import { produce } from "immer";
import { AnimatePresence, motion } from "framer-motion";
import { DeleteAddOn, GetAllAddOns, UpdateAddOn } from "@/apis/services/services.api";
import AddNewAddOnModel from "./Add-New-Add-On-Model/AddNewAddOnModel";
import usePriceFormat from "@/hooks/usePriceFormat";
import { Input, Popup, OptimizedImage } from "@/components/common";
import { useToast } from "@/context/Toaster-Context/ToasterContext";

// Initial State
const initialState = {
  addNewAddOn: false,
  deletedAddon: null,
  editingId: null,
  editFormData: {
    name: "",
    description: "",
    image: null,
    price: 0,
  },
};

// Actions
const actions = {
  START_EDIT: "START_EDIT",
  CANCEL_EDIT: "CANCEL_EDIT",
  UPDATE_EDIT_FORM: "UPDATE_EDIT_FORM",
  OPEN_ADD_NEW: "OPEN_ADD_NEW",
  CLOSE_ADD_NEW: "CLOSE_ADD_NEW",
  SET_DELETE_ADDON: "SET_DELETE_ADDON",
  CLEAR_DELETE_ADDON: "CLEAR_DELETE_ADDON",
  UPDATE_IMAGE: "UPDATE_IMAGE", // Action for image update
};

// Reducer
function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case actions.START_EDIT:
        draft.editingId = action.payload._id;
        draft.editFormData = {
          name: action.payload.name,
          description: action.payload.description,
          image: action.payload.image,
          price: action.payload.price,
        };
        break;
      case actions.CANCEL_EDIT:
        draft.editingId = null;
        draft.editFormData = { name: "", description: "", image: null, price: 0 };
        break;
      case actions.UPDATE_EDIT_FORM:
        draft.editFormData[action.payload.field] = action.payload.value;
        break;
      case actions.OPEN_ADD_NEW:
        draft.addNewAddOn = true;
        break;
      case actions.CLOSE_ADD_NEW:
        draft.addNewAddOn = false;
        break;
      case actions.SET_DELETE_ADDON:
        draft.deletedAddon = action.payload;
        break;
      case actions.CLEAR_DELETE_ADDON:
        draft.deletedAddon = null;
        break;
      case actions.UPDATE_IMAGE:
        draft.editFormData.image = action.payload;
        break;
      default:
        break;
    }
  });
}

// Component
export default function Addons() {
  const { data: addons, isLoading } = GetAllAddOns();
  const { mutate: deleteAddOn } = DeleteAddOn();
  const { mutate: updateAddOn } = UpdateAddOn();
  const { addToast } = useToast();
  const formatPrice = usePriceFormat();

  const [state, dispatch] = useReducer(reducer, initialState);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="border-main h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  const handleEdit = (addon) => {
    dispatch({ type: actions.START_EDIT, payload: addon });
  };

  const handleUpdate = () => {
    updateAddOn(
      {
        id: state.editingId,
        data: state.editFormData,
      },
      {
        onSuccess: (response) => {
          addToast(response.message, "success");
          dispatch({ type: actions.CANCEL_EDIT });
        },
        onError: (error) => {
          addToast(error.response?.data?.message || "Something went wrong", "error");
          console.error("Error updating add-on:", error);
        },
      },
    );
  };

  const handleDelete = (addon) => {
    dispatch({ type: actions.SET_DELETE_ADDON, payload: addon });
  };

  const confirmDelete = () => {
    deleteAddOn(state.deletedAddon._id, {
      onSuccess: (response) => {
        addToast(response.message, "success");
        dispatch({ type: actions.CLEAR_DELETE_ADDON });
      },
      onError: (error) => {
        console.error("Error deleting add-on:", error);
      },
    });
  };

  const handleAdd = () => {
    dispatch({ type: actions.OPEN_ADD_NEW });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch({ type: actions.UPDATE_IMAGE, payload: file });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Service Add-ons</h2>
        <button
          onClick={handleAdd}
          className="bg-main hover:bg-opacity-90 rounded-lg px-4 py-2 text-white transition-colors"
        >
          Add New Add-on
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Description", "Price", "Image", "Actions"].map(
                (header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {addons?.data?.map((addon) => (
              <tr key={addon._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {state.editingId === addon._id ? (
                    <Input
                      value={state.editFormData.name}
                      onChange={(e) =>
                        dispatch({
                          type: actions.UPDATE_EDIT_FORM,
                          payload: { field: "name", value: e.target.value },
                        })
                      }
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
                      onChange={(e) =>
                        dispatch({
                          type: actions.UPDATE_EDIT_FORM,
                          payload: { field: "description", value: e.target.value },
                        })
                      }
                      placeholder="Enter description"
                    />
                  ) : (
                    <div className="max-w-md text-sm text-gray-500">
                      {addon.description}
                    </div>
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
                          payload: { field: "price", value: parseFloat(e.target.value) },
                        })
                      }
                      placeholder="Enter price"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">
                      {formatPrice(addon.price)}
                    </div>
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
                      {state.editFormData.image &&
                        state.editFormData.image instanceof File && (
                          <OptimizedImage
                            src={URL.createObjectURL(state.editFormData.image)}
                            alt="Addon"
                            className="h-14 w-14 rounded-full"
                          />
                        )}
                    </div>
                  ) : (
                    <img
                      src={addon.image}
                      alt="Addon"
                      className="h-14 w-14 rounded-full"
                    />
                  )}
                </td>

                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  {state.editingId === addon._id ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="mr-4 text-green-600 hover:text-green-900"
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
                        className="mr-4 text-indigo-600 hover:text-indigo-900"
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
            <h3 className="mb-4 text-lg font-semibold">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this Add-on?</p>
            <p className="mb-6 text-center text-red-500">
              <strong>{state.deletedAddon.name}</strong>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => dispatch({ type: actions.CLEAR_DELETE_ADDON })}
                className="rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </Popup>
        )}

        {state.addNewAddOn && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AddNewAddOnModel
              closeModel={() => dispatch({ type: actions.CLOSE_ADD_NEW })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
