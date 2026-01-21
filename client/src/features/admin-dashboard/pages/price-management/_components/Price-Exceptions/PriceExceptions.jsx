"use client";

import {
  AddPriceExceptions,
  DeletePriceExceptions,
  GetPriceExceptions,
  UpdatedPriceExceptions,
} from "@/apis/price/price.api";
import { Input, Loading, Popup } from "@/components/common";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import usePriceFormat from "@/hooks/usePriceFormat";
import { motion } from "framer-motion";
import { produce } from "immer";
import { useReducer, useState } from "react";

const initialState = {
  newException: {
    date: new Date().toISOString()?.split("T")[0],
    isFixedHourly: false,
    defaultPricePerSlot: "",
    perSlotDiscounts: {},
    newSlotCount: "",
    newDiscountPercent: "",
  },
  editingRuleId: null,
  editedRule: null,
};

const reducerFunction = (state, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "SET_NEW_EXCEPTION_FIELD":
        draft.newException[action.field] = action.value;
        break;

      case "ADD_DISCOUNT_TO_NEW_RULE":
        draft.newException.perSlotDiscounts[draft.newException.newSlotCount] = Number(
          draft.newException.newDiscountPercent,
        );
        draft.newException.newSlotCount = "";
        draft.newException.newDiscountPercent = "";
        break;

      case "REMOVE_DISCOUNT_FROM_NEW_RULE":
        delete draft.newException.perSlotDiscounts[action.slots];
        break;

      case "RESET_NEW_RULE":
        draft.newException = {
          date: new Date().toISOString()?.split("T")[0],
          isFixedHourly: false,
          defaultPricePerSlot: "",
          perSlotDiscounts: {},
          newSlotCount: "",
          newDiscountPercent: "",
        };
        break;

      case "START_EDIT_RULE":
        draft.editingRuleId = action.rule._id;
        draft.editedRule = {
          ...action.rule,
          newSlotCount: "",
          newDiscountPercent: "",
        };
        break;

      case "CANCEL_EDIT_RULE":
        draft.editingRuleId = null;
        draft.editedRule = null;
        break;

      case "SET_EDITED_RULE_FIELD":
        if (draft.editedRule) {
          draft.editedRule[action.field] = action.value;
        }
        break;

      case "ADD_DISCOUNT_TO_EDITED_RULE":
        if (draft.editedRule) {
          draft.editedRule.perSlotDiscounts[draft.editedRule.newSlotCount] = Number(
            draft.editedRule.newDiscountPercent,
          );
          draft.editedRule.newSlotCount = "";
          draft.editedRule.newDiscountPercent = "";
        }
        break;

      case "REMOVE_DISCOUNT_FROM_EDITED_RULE":
        if (draft.editedRule) {
          delete draft.editedRule.perSlotDiscounts[action.slots];
        }
        break;

      default:
        break;
    }
  });
};

export default function PriceExceptions({ selectedStudio }) {
  const { addToast } = useToast();
  const [state, dispatch] = useReducer(reducerFunction, initialState);
  const { data: priceExceptions, isLoading } = GetPriceExceptions(selectedStudio);
  const { mutate: addPriceException } = AddPriceExceptions(selectedStudio);
  const { mutate: updatePriceRule } = UpdatedPriceExceptions(selectedStudio);
  const { mutate: deletePriceRule } = DeletePriceExceptions(selectedStudio);
  const [selectedRule, setSelectedRule] = useState(null);

  const handleAddDiscountToNewRule = () => {
    const { newSlotCount, newDiscountPercent } = state.newException;
    if (!newSlotCount || !newDiscountPercent) {
      addToast("Please fill in both slot count and discount percentage", "error");
      return;
    }
    dispatch({ type: "ADD_DISCOUNT_TO_NEW_RULE" });
  };

  const handleRemoveDiscountFromNewRule = (slots) => {
    dispatch({ type: "REMOVE_DISCOUNT_FROM_NEW_RULE", slots });
  };

  const handleAddException = () => {
    addPriceException(
      {
        ...state.newException,
        studio: selectedStudio,
      },
      {
        onSuccess: (response) => {
          addToast(response.message || "Price rule added successfully", "success");
          dispatch({ type: "RESET_NEW_RULE" });
        },
        onError: (error) => {
          addToast(error?.response?.data?.message || "Something went wrong", "error");
        },
      },
    );
  };

  const handleEditRule = (rule) => {
    dispatch({ type: "START_EDIT_RULE", rule });
  };

  const handleSaveEdit = () => {
    // Assuming updatePriceRule is available in the scope
    // If not, you'll need to import or define it
    updatePriceRule(
      { payload: state.editedRule },
      {
        onSuccess: (response) => {
          addToast(response.message || "Price rule updated successfully", "success");
          dispatch({ type: "CANCEL_EDIT_RULE" });
        },
        onError: (error) => {
          addToast(error?.response?.data?.message || "Something went wrong", "error");
        },
      },
    );
  };

  const handleCancelEdit = () => {
    dispatch({ type: "CANCEL_EDIT_RULE" });
  };

  const handleAddDiscountToEditedRule = () => {
    if (!state.editedRule.newSlotCount || !state.editedRule.newDiscountPercent) {
      addToast("Please fill in both slot count and discount percentage", "error");
      return;
    }
    dispatch({ type: "ADD_DISCOUNT_TO_EDITED_RULE" });
  };

  const handleRemoveDiscountFromEditedRule = (slots) => {
    dispatch({ type: "REMOVE_DISCOUNT_FROM_EDITED_RULE", slots });
  };

  const confirmDelete = () => {
    deletePriceRule(
      {
        payload: {
          studio: selectedRule.studio,
          date: selectedRule.date,
        },
      },
      {
        onSuccess: (response) => {
          addToast(response.message || "Price rule deleted successfully", "success");
          setSelectedRule(null);
        },
        onError: (error) => {
          addToast(error?.response?.data?.message || "Something went wrong", "error");
        },
      },
    );
  };

  // Helper function to format price
  const formatPrice = usePriceFormat();

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="space-y-10">
          {/* Price Exceptions Form  */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-gray-50 p-8 shadow-sm"
          >
            <h3 className="mb-6 text-xl font-semibold text-gray-800">
              Add New Price Exception
            </h3>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                type="date"
                label="Exception Date"
                value={state.newException.date}
                onChange={(e) =>
                  dispatch({
                    type: "SET_NEW_EXCEPTION_FIELD",
                    field: "date",
                    value: e.target.value,
                  })
                }
              />
              <Input
                type="number"
                label="Override Price per Slot"
                value={state.newException.defaultPricePerSlot}
                onChange={(e) =>
                  dispatch({
                    type: "SET_NEW_EXCEPTION_FIELD",
                    field: "defaultPricePerSlot",
                    value: e.target.value,
                  })
                }
                min={0}
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={state.newException.isFixedHourly}
                  onChange={(e) => {
                    const isTrue = e.target.checked;

                    if (!isTrue) {
                      dispatch({
                        type: "SET_NEW_EXCEPTION_FIELD",
                        field: "perSlotDiscounts",
                        value: {},
                      });
                    }

                    dispatch({
                      type: "SET_NEW_EXCEPTION_FIELD",
                      field: "isFixedHourly",
                      value: isTrue,
                    });
                  }}
                  className="h-5 w-5 rounded text-rose-500"
                />
                <label className="ml-3 text-gray-700">Fixed Hourly Rate</label>
              </div>
            </div>

            {/* Discount section for new exception */}
            {!state.newException.isFixedHourly && (
              <div className="mb-6">
                <h4 className="mb-4 text-lg font-medium text-gray-800">Add Discounts</h4>
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    type="number"
                    label="Number of Slots"
                    value={state.newException.newSlotCount}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_NEW_EXCEPTION_FIELD",
                        field: "newSlotCount",
                        value: e.target.value,
                      })
                    }
                    min={1}
                    placeholder="Enter number of slots"
                  />
                  <Input
                    type="number"
                    label="Discount Percentage"
                    value={state.newException.newDiscountPercent}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_NEW_EXCEPTION_FIELD",
                        field: "newDiscountPercent",
                        value: e.target.value,
                      })
                    }
                    min={0}
                    max={100}
                    placeholder="Enter discount percentage"
                  />
                </div>
                <button
                  onClick={handleAddDiscountToNewRule}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Add Discount
                </button>

                {/* Display discounts for new exception */}
                {Object.entries(state.newException.perSlotDiscounts).length > 0 && (
                  <div className="mt-4 space-y-3">
                    {Object.entries(state.newException.perSlotDiscounts).map(
                      ([slots, discount]) => (
                        <div
                          key={slots}
                          className="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm text-gray-700"
                        >
                          <span>
                            {slots} slots:
                            <span className="ml-2 font-semibold text-rose-500">
                              {discount}% discount
                            </span>
                          </span>
                          <button
                            onClick={() => handleRemoveDiscountFromNewRule(slots)}
                            className="text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleAddException}
              className="rounded-lg bg-rose-500 px-6 py-3 text-white shadow-sm transition-colors hover:bg-rose-600"
            >
              Add Exception
            </button>

            {/* Display existing exceptions */}
            {priceExceptions?.data?.length > 0 && (
              <div className="mt-8 space-y-4">
                <h4 className="mb-2 text-lg font-medium text-gray-800">
                  Existing Price Exceptions
                </h4>
                {priceExceptions.data.map((exception) => (
                  <PriceRuleCard
                    key={exception._id}
                    rule={exception}
                    state={state}
                    dispatch={dispatch}
                    setSelectedRule={setSelectedRule}
                    handleEditRule={handleEditRule}
                    handleSaveEdit={handleSaveEdit}
                    handleCancelEdit={handleCancelEdit}
                    formatPrice={formatPrice}
                    handleAddDiscountToEditedRule={handleAddDiscountToEditedRule}
                    handleRemoveDiscountFromEditedRule={
                      handleRemoveDiscountFromEditedRule
                    }
                  />
                ))}
              </div>
            )}
          </motion.div>

          {priceExceptions?.data === null && (
            <p className="text-main text-md text-center font-semibold">
              {priceExceptions.message}
            </p>
          )}
        </div>
      </motion.div>

      {/* Confirmation Modal - You would need to implement this based on your UI library */}
      {selectedRule && (
        <Popup>
          <h3 className="mb-4 text-xl font-semibold">Confirm Deletion</h3>
          <p className="mb-6">Are you sure you want to delete this price rule?</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setSelectedRule(null)}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
}

// PriceRuleCard Component
const PriceRuleCard = ({
  rule,
  state,
  dispatch,
  setSelectedRule,
  handleEditRule,
  handleSaveEdit,
  handleCancelEdit,
  getDayName,
  formatPrice,
  handleAddDiscountToEditedRule,
  handleRemoveDiscountFromEditedRule,
}) => {
  const isEditing = state.editingRuleId === rule._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-white p-6 shadow-sm"
    >
      {isEditing ? (
        <RuleEditor
          rule={rule}
          state={state}
          dispatch={dispatch}
          getDayName={getDayName}
        />
      ) : (
        <ExceptionDisplay rule={rule} formatPrice={formatPrice} />
      )}
      <DiscountList
        discounts={isEditing ? state.editedRule.perSlotDiscounts : rule.perSlotDiscounts}
        isEditing={isEditing}
        handleRemoveDiscount={handleRemoveDiscountFromEditedRule}
      />
      {isEditing && !state.editedRule.isFixedHourly && (
        <DiscountEditor
          state={state}
          dispatch={dispatch}
          handleAddDiscount={handleAddDiscountToEditedRule}
        />
      )}
      <ActionButtons
        isEditing={isEditing}
        rule={rule}
        setSelectedRule={setSelectedRule}
        handleEditRule={handleEditRule}
        handleSaveEdit={handleSaveEdit}
        handleCancelEdit={handleCancelEdit}
      />
    </motion.div>
  );
};

// ExceptionDisplay Component - Modified for date-based exceptions
const ExceptionDisplay = ({ rule, formatPrice }) => (
  <>
    <div className="mb-4 flex items-center justify-between gap-x-3">
      <h4 className="text-lg font-medium text-gray-800">
        Date : {new Date(rule.date).toLocaleDateString()}
      </h4>
      <span className="text-lg font-semibold text-rose-500">
        {formatPrice(rule.defaultPricePerSlot)} per slot
      </span>
    </div>
    <div className="mb-4 flex items-center">
      <input
        type="checkbox"
        checked={rule.isFixedHourly}
        disabled
        className="h-5 w-5 rounded text-rose-500 opacity-60"
      />
      <label className="ml-3 text-gray-700">Fixed Hourly Rate</label>
    </div>
  </>
);

// RuleEditor Component
const RuleEditor = ({ state, dispatch }) => (
  <>
    <div className="mb-4 flex items-center justify-between gap-x-3 py-4">
      <Input
        type="date"
        label="Exception Date"
        value={new Date(state.editedRule.date).toISOString()?.split("T")[0]}
        onChange={(e) =>
          dispatch({
            type: "SET_EDITED_RULE_FIELD",
            field: "date",
            value: e.target.value,
          })
        }
      />
      <input
        type="number"
        value={state.editedRule.defaultPricePerSlot}
        onChange={(e) =>
          dispatch({
            type: "SET_EDITED_RULE_FIELD",
            field: "defaultPricePerSlot",
            value: Number(e.target.value),
          })
        }
        className="w-32 rounded-lg border border-gray-300 p-2 transition-shadow focus:ring-2 focus:ring-rose-500"
        min={0}
      />
    </div>
    <div className="mb-4 flex items-center">
      <input
        type="checkbox"
        checked={state.editedRule.isFixedHourly}
        onChange={(e) =>
          dispatch({
            type: "SET_EDITED_RULE_FIELD",
            field: "isFixedHourly",
            value: e.target.checked,
          })
        }
        className="h-5 w-5 rounded text-rose-500"
      />
      <label className="ml-3 text-gray-700">Fixed Hourly Rate</label>
    </div>
  </>
);

// DiscountList Component
const DiscountList = ({ discounts, isEditing, handleRemoveDiscount }) => (
  <>
    {Object.entries(discounts || {}).length > 0 && (
      <div className="mt-4 space-y-3">
        {Object.entries(discounts).map(([slots, discount]) => (
          <div
            key={slots}
            className="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm text-gray-700"
          >
            <span>
              {slots} slots:
              <span className="ml-2 font-semibold text-rose-500">
                {discount}% discount
              </span>
            </span>
            {isEditing && (
              <button
                onClick={() => handleRemoveDiscount(slots)}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    )}
  </>
);

// DiscountEditor Component
const DiscountEditor = ({ state, dispatch, handleAddDiscount }) => (
  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
    <Input
      type="number"
      label="Number of Slots"
      value={state.editedRule.newSlotCount}
      onChange={(e) =>
        dispatch({
          type: "SET_EDITED_RULE_FIELD",
          field: "newSlotCount",
          value: e.target.value,
        })
      }
      min={1}
      placeholder="Enter number of slots"
    />
    <Input
      type="number"
      label="Discount Percentage"
      value={state.editedRule.newDiscountPercent}
      onChange={(e) =>
        dispatch({
          type: "SET_EDITED_RULE_FIELD",
          field: "newDiscountPercent",
          value: e.target.value,
        })
      }
      min={0}
      max={100}
      placeholder="Enter discount percentage"
    />
    <button
      onClick={handleAddDiscount}
      className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
    >
      Add Discount
    </button>
  </div>
);

// ActionButtons Component
const ActionButtons = ({
  isEditing,
  rule,
  setSelectedRule,
  handleEditRule,
  handleSaveEdit,
  handleCancelEdit,
}) => (
  <div className="mt-4 flex gap-3">
    {isEditing ? (
      <>
        <button
          onClick={handleSaveEdit}
          className="block w-fit rounded-lg border border-green-500 px-4 py-2 text-left text-sm text-green-500 hover:text-green-600"
        >
          Save
        </button>
        <button
          onClick={handleCancelEdit}
          className="block w-fit rounded-lg border border-gray-500 px-4 py-2 text-left text-sm text-gray-500 hover:text-gray-600"
        >
          Cancel
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => setSelectedRule(rule)}
          className="block w-fit rounded-lg border border-red-500 px-4 py-2 text-left text-sm text-red-500 hover:text-red-600"
        >
          Delete Rule
        </button>
        <button
          onClick={() => handleEditRule(rule)}
          className="block w-fit rounded-lg border border-blue-500 px-4 py-2 text-left text-sm text-blue-500 hover:text-blue-600"
        >
          Edit Rule
        </button>
      </>
    )}
  </div>
);
