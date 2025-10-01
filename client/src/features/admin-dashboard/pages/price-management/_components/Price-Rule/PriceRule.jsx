import  { useReducer, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
    AddPriceRule,
    DeletePriceRule,
    GetPriceRules,
    UpdatedPriceRules,
} from "@/apis/price/price.api";
import usePriceFormat from "@/hooks/usePriceFormat";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { produce } from "immer";
import { Popup, Loading } from '@/components/common';
import {

    NewPriceRuleForm,
    PriceRuleList,
} from "../Price-Mange/PriceComponents";


// Initial state and reducer (unchanged)
const initialState = {
    newRule: {
        dayOfWeek: "",
        isFixedHourly: false,
        defaultPricePerSlot: "",
        perSlotDiscounts: {},
        newSlotCount: "",
        newDiscountPercent: "",
    },
    editingRuleId: null,
    editedRule: null,
};

function reducer(state, action) {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SET_NEW_RULE_FIELD":
                draft.newRule[action.field] = action.value;
                break;
            case "ADD_DISCOUNT_TO_NEW_RULE":
                draft.newRule.perSlotDiscounts[draft.newRule.newSlotCount] = Number(
                    draft.newRule.newDiscountPercent
                );
                draft.newRule.newSlotCount = "";
                draft.newRule.newDiscountPercent = "";
                break;
            case "REMOVE_DISCOUNT_FROM_NEW_RULE":
                delete draft.newRule.perSlotDiscounts[action.slots];
                break;
            case "RESET_NEW_RULE":
                draft.newRule = initialState.newRule;
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
                draft.editedRule[action.field] = action.value;
                break;
            case "ADD_DISCOUNT_TO_EDITED_RULE":
                draft.editedRule.perSlotDiscounts[draft.editedRule.newSlotCount] =
                    Number(draft.editedRule.newDiscountPercent);
                draft.editedRule.newSlotCount = "";
                draft.editedRule.newDiscountPercent = "";
                break;
            case "REMOVE_DISCOUNT_FROM_EDITED_RULE":
                delete draft.editedRule.perSlotDiscounts[action.slots];
                break;
            default:
                break;
        }
    });
}

// Main PriceRule component
export default function PriceRule({ selectedStudio }) {
    const { data: priceRulesData, isLoading } = GetPriceRules(selectedStudio);
    const { mutate: deletePriceRule } = DeletePriceRule(selectedStudio);
    const { mutate: addNewRule } = AddPriceRule(selectedStudio);
    const { mutate: updatePriceRule } = UpdatedPriceRules();
    const { addToast } = useToast();
    const formatPrice = usePriceFormat();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [selectedRule, setSelectedRule] = useState(null);

    const { newRule } = state;

    const getDayName = (day) =>
        [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ][day];

    const handleAddDiscountToNewRule = () => {
        const { newSlotCount, newDiscountPercent } = newRule;
        if (!newSlotCount || !newDiscountPercent) {
            addToast(
                "Please fill in both slot count and discount percentage",
                "error"
            );
            return;
        }
        dispatch({ type: "ADD_DISCOUNT_TO_NEW_RULE" });
    };

    const handleRemoveDiscountFromNewRule = (slots) => {
        dispatch({ type: "REMOVE_DISCOUNT_FROM_NEW_RULE", slots });
    };

    const handleAddPriceRule = () => {
        addNewRule(
            {
                ...newRule,
                studio: selectedStudio,
                dayOfWeek: Number(newRule.dayOfWeek),
            },
            {
                onSuccess: (response) => {
                    addToast(
                        response.message || "Price rule added successfully",
                        "success"
                    );
                    dispatch({ type: "RESET_NEW_RULE" });
                },
                onError: (error) => {
                    addToast(
                        error?.response?.data?.message || "Something went wrong",
                        "error"
                    );
                },
            }
        );
    };

    const handleEditRule = (rule) => {
        dispatch({ type: "START_EDIT_RULE", rule });
    };

    const handleSaveEdit = () => {
        updatePriceRule(
            { payload: state.editedRule },
            {
                onSuccess: (response) => {
                    addToast(
                        response.message || "Price rule updated successfully",
                        "success"
                    );
                    dispatch({ type: "CANCEL_EDIT_RULE" });
                },
                onError: (error) => {
                    addToast(
                        error?.response?.data?.message || "Something went wrong",
                        "error"
                    );
                },
            }
        );
    };

    const handleCancelEdit = () => {
        dispatch({ type: "CANCEL_EDIT_RULE" });
    };

    const handleAddDiscountToEditedRule = () => {
        if (
            !state.editedRule.newSlotCount ||
            !state.editedRule.newDiscountPercent
        ) {
            addToast(
                "Please fill in both slot count and discount percentage",
                "error"
            );
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
                    dayOfWeek: selectedRule.dayOfWeek,
                },
            },
            {
                onSuccess: (response) => {
                    addToast(
                        response.message || "Price rule deleted successfully",
                        "success"
                    );
                    setSelectedRule(null);
                },
                onError: (error) => {
                    addToast(
                        error?.response?.data?.message || "Something went wrong",
                        "error"
                    );
                },
            }
        );
    };

    if (isLoading) return;
    <Loading />;

    return (
        <div className="space-y-10">
            <NewPriceRuleForm
                newRule={newRule}
                dispatch={dispatch}
                handleAddPriceRule={handleAddPriceRule}
                getDayName={getDayName}
                handleAddDiscountToNewRule={handleAddDiscountToNewRule}
                handleRemoveDiscountFromNewRule={handleRemoveDiscountFromNewRule}
                isDay = {true}
                label={"Add New Price Rule"}
            />

            <PriceRuleList
                priceRulesData={priceRulesData}
                state={state}
                dispatch={dispatch}
                setSelectedRule={setSelectedRule}
                handleEditRule={handleEditRule}
                handleSaveEdit={handleSaveEdit}
                handleCancelEdit={handleCancelEdit}
                getDayName={getDayName}
                formatPrice={formatPrice}
                handleAddDiscountToEditedRule={handleAddDiscountToEditedRule}
                handleRemoveDiscountFromEditedRule={handleRemoveDiscountFromEditedRule}
            />

            {selectedRule && (
                <AnimatePresence>
                    <Popup>
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-4">Are you sure you want to delete this Rule?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedRule(null)}
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
                </AnimatePresence>
            )}
        </div>
    );
}
