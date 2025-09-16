import React, { useReducer } from "react";
import {
  DeletePackage,
  GetAllCategories,
  GetAllPackages,
  UpdatePackage,
} from "@/apis/services/services.api";
import AddNewPackageModel from "./Add-New-Package-Model/AddNewPackageModel";
import { motion, AnimatePresence } from "framer-motion";
import { produce } from "immer";
import usePriceFormat from "@/hooks/usePriceFormat";
import { Loading, Alert, SelectInput, Input, Popup } from "@/components/common";

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
      case "UPDATE_FIELD": {
        const { field, value } = action.payload;
        if (field.includes(".")) {
          const [parent, child] = field.split(".");
          draft.editingPackage[parent][child] = value;
        } else {
          draft.editingPackage[field] = value;
        }
        break;
      }
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
  <div className="mt-3 space-y-3">
    <div className="mb-1 text-sm font-medium text-gray-700">{placeholder}s</div>
    {items.map((item, index) => (
      <div key={index} className="flex items-center gap-2">
        <Input
          className="flex-1"
          value={item}
          onChange={(e) => onChange(index, e.target.value)}
          placeholder={placeholder}
        />
        <button
          onClick={() => onChange(index, null)}
          className="rounded-full bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100 hover:text-red-700"
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    ))}
    <button
      onClick={() => onChange(items.length, "")}
      className="text-main hover:text-main/90 bg-main/5 hover:bg-main/10 mt-1 flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
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
  const formatPrice = usePriceFormat();

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
      },
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

  const updateField = (field, value) =>
    dispatch({ type: "UPDATE_FIELD", payload: { field, value } });

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages?.data.map((pkg) => {
          const isEditing = state.editingPackage?._id === pkg._id;
          const current = isEditing ? state.editingPackage : pkg;

          return (
            <motion.div
              key={pkg._id}
              className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all ${isEditing ? "ring-main/30 ring-2" : "hover:shadow-xl"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isEditing ? (
                <Input
                  label="Name"
                  value={current.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="mb-0"
                />
              ) : (
                <div className="from-main/10 to-main/5 bg-gradient-to-r px-6 py-4">
                  <h3 className="text-xl font-semibold text-gray-800">{pkg.name}</h3>
                </div>
              )}

              <div className="flex-grow p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      label="Description"
                      value={current.description}
                      onChange={(e) => updateField("description", e.target.value)}
                    />
                    <SelectInput
                      label="Category"
                      value={current.category?.name?.ar}
                      options={packagesCategories?.data.map((c) => ({
                        value: c._id,
                        label: c.name?.ar,
                      }))}
                      onChange={(e) => updateField("category.name", e.target.value)}
                    />
                    <label className="flex items-center gap-2 rounded-md border bg-gray-50 p-2">
                      <input
                        type="checkbox"
                        checked={current.isFixed}
                        onChange={(e) => updateField("isFixed", e.target.checked)}
                        className="accent-main h-4 w-4"
                      />
                      <span className="text-sm font-medium">Fixed Price Package</span>
                    </label>

                    <Input
                      label="Price"
                      value={current.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      className="mt-8 mb-4"
                    />

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
                      p
                      placeholder="Post-session Benefit"
                    />
                  </div>
                ) : (
                  <>
                    <p className="mb-4 text-sm text-gray-600">{pkg.description}</p>
                    <div className="mb-5 flex flex-wrap items-center justify-evenly gap-4">
                      <span className="bg-main/10 text-main rounded-full px-3 py-1 text-xs font-medium">
                        {pkg.category?.name?.ar}
                      </span>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {formatPrice(pkg.price)}
                      </span>
                      {pkg.isFixed && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Fixed Price
                        </span>
                      )}
                    </div>

                    {pkg.target_audience.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 flex items-center text-sm font-semibold text-gray-700">
                          <i className="fa-solid fa-users text-main/70 mr-2"></i> Target
                          Audience
                        </h4>
                        <ul className="list-inside list-disc space-y-1 pl-1 text-sm text-gray-700">
                          {pkg.target_audience.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {pkg.details.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 flex items-center text-sm font-semibold text-gray-700">
                          <i className="fa-solid fa-list-check text-main/70 mr-2"></i>{" "}
                          Package Details
                        </h4>
                        <ul className="list-inside list-disc space-y-1 pl-1 text-sm text-gray-700">
                          {pkg.details.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {pkg.post_session_benefits.length > 0 && (
                      <div>
                        <h4 className="mb-2 flex items-center text-sm font-semibold text-gray-700">
                          <i className="fa-solid fa-gift text-main/70 mr-2"></i>{" "}
                          Post-session Benefits
                        </h4>
                        <ul className="list-inside list-disc space-y-1 pl-1 text-sm text-gray-700">
                          {pkg.post_session_benefits.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div
                className={`border-main flex justify-end gap-2 border-t p-4 ${isEditing ? "bg-gray-50" : ""}`}
              >
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
                    >
                      <i className="fa-solid fa-check"></i> Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                    >
                      <i className="fa-solid fa-times"></i> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="flex items-center gap-1 rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      <i className="fa-solid fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg)}
                      className="flex items-center gap-1 rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
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
        <div className="rounded-xl bg-white p-8 text-center shadow-md">
          <div className="mb-4 text-5xl text-gray-400">
            <i className="fa-solid fa-box-open"></i>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-700">No Packages Found</h3>
          <p className="mb-4 text-gray-500">Start by adding your first service package</p>
          <button
            onClick={() => dispatch({ type: "SHOW_ADD_MODAL" })}
            className="bg-main hover:bg-main/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white"
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
            className="fixed right-4 bottom-4 z-50"
          >
            <Alert type="success">{state.deleteMessage}</Alert>
          </motion.div>
        )}

        {state.deletedPackage && (
          <Popup>
            <div className="mb-2 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl text-red-500">
                <i className="fa-solid fa-trash"></i>
              </div>
            </div>
            <h3 className="mb-4 text-center text-xl font-semibold">Confirm Delete</h3>
            <p className="mb-4 text-center text-gray-600">
              Are you sure you want to delete this package?
            </p>
            <p className="mb-6 rounded-lg bg-red-50 py-2 text-center font-bold text-red-500">
              {state.deletedPackage.name}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => dispatch({ type: "CLEAR_DELETED_PACKAGE" })}
                className="rounded-lg bg-gray-200 px-5 py-2.5 font-medium transition-colors hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-red-600"
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
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AddNewPackageModel closeModel={() => dispatch({ type: "HIDE_ADD_MODAL" })} />
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
