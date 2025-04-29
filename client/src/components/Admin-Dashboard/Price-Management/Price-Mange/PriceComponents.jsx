import { motion } from "framer-motion";
import Input from "../../../shared/Input/Input";
import SelectInput from "../../../shared/Select-Input/SelectInput";

const PriceRuleList = ({ priceRulesData, state, dispatch, setSelectedRule, handleEditRule, handleSaveEdit, handleCancelEdit, getDayName, formatPrice, handleAddDiscountToEditedRule, handleRemoveDiscountFromEditedRule }) => {
  return (
    <>
      {priceRulesData?.data.length > 0 && (
        <div className="mt-8 space-y-6">
          {priceRulesData?.data?.map((rule) => (
            <PriceRuleCard
              key={rule._id}
              rule={rule}
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
          ))}
        </div>
      )}
    </>
  );
};

const PriceRuleCard = ({ rule, state, dispatch, setSelectedRule, handleEditRule, handleSaveEdit, handleCancelEdit, getDayName, formatPrice, handleAddDiscountToEditedRule, handleRemoveDiscountFromEditedRule }) => {
  const isEditing = state.editingRuleId === rule._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      {isEditing ? (
        <RuleEditor rule={rule} state={state} dispatch={dispatch} getDayName={getDayName} />
      ) : (
        <RuleDisplay rule={rule} getDayName={getDayName} formatPrice={formatPrice} />
      )}
      <DiscountList
        discounts={isEditing ? state.editedRule.perSlotDiscounts : rule.perSlotDiscounts}
        isEditing={isEditing}
        handleRemoveDiscount={handleRemoveDiscountFromEditedRule}
      />
      {isEditing && !state.editedRule.isFixedHourly && <DiscountEditor state={state} dispatch={dispatch} handleAddDiscount={handleAddDiscountToEditedRule} />}
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

const RuleDisplay = ({ rule, getDayName, formatPrice }) => (
  <>
    <div className="flex justify-between items-center mb-4 gap-x-3">
      <h4 className="text-lg font-medium text-gray-800">{getDayName(rule.dayOfWeek)}</h4>
      <span className="text-rose-500 font-semibold text-lg">
        {formatPrice(rule.defaultPricePerSlot)} per slot
      </span>
    </div>
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        checked={rule.isFixedHourly}
        disabled
        className="w-5 h-5 text-rose-500 rounded opacity-60"
      />
      <label className="ml-3 text-gray-700">Fixed Hourly Rate</label>
    </div>
  </>
);

const RuleEditor = ({ state, dispatch, getDayName }) => (
  <>
    <div className="flex justify-between items-center mb-4 gap-x-3">
      <select
        value={state.editedRule.dayOfWeek}
        onChange={(e) =>
          dispatch({
            type: "SET_EDITED_RULE_FIELD",
            field: "dayOfWeek",
            value: Number(e.target.value),
          })
        }
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 transition-shadow"
      >
        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
          <option key={day} value={day}>{getDayName(day)}</option>
        ))}
      </select>
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
        className="w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 transition-shadow"
        min={0}
      />
    </div>
    <div className="flex items-center mb-4">
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
        className="w-5 h-5 text-rose-500 rounded"
      />
      <label className="ml-3 text-gray-700">Fixed Hourly Rate</label>
    </div>
  </>
);

const DiscountList = ({ discounts, isEditing, handleRemoveDiscount }) => (
  <>
    {Object.entries(discounts).length > 0 && (
      <div className="mt-4 space-y-3">
        {Object.entries(discounts).map(([slots, discount]) => (
          <div
            key={slots}
            className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg text-gray-700"
          >
            <span>
              {slots} slots:
              <span className="font-semibold ml-2 text-rose-500">{discount}% discount</span>
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

const DiscountEditor = ({ state, dispatch, handleAddDiscount }) => (

  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
    >
      Add Discount
    </button>
  </div>
);

const ActionButtons = ({ isEditing, rule, setSelectedRule, handleEditRule, handleSaveEdit, handleCancelEdit }) => (
  <div className="flex gap-3 mt-4">
    {isEditing ? (
      <>
        <button
          onClick={handleSaveEdit}
          className="px-4 py-2 text-green-500 hover:text-green-600 text-sm block w-fit text-left border border-green-500 rounded-lg"
        >
          Save
        </button>
        <button
          onClick={handleCancelEdit}
          className="px-4 py-2 text-gray-500 hover:text-gray-600 text-sm block w-fit text-left border border-gray-500 rounded-lg"
        >
          Cancel
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => setSelectedRule(rule)}
          className="px-4 py-2 text-red-500 hover:text-red-600 text-sm block w-fit text-left border border-red-500 rounded-lg"
        >
          Delete Rule
        </button>
        <button
          onClick={() => handleEditRule(rule)}
          className="px-4 py-2 text-blue-500 hover:text-blue-600 text-sm block w-fit text-left border border-blue-500 rounded-lg"
        >
          Edit Rule
        </button>
      </>
    )}
  </div>
);

// New component for adding a new price rule
const NewPriceRuleForm = ({ newRule, dispatch, handleAddPriceRule, getDayName, handleAddDiscountToNewRule, handleRemoveDiscountFromNewRule, isDay, label }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-gray-50 p-8 rounded-xl shadow-sm"
  >
    <h3 className="text-xl font-semibold mb-6 text-gray-800">
      {label}
    </h3>
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {
          isDay
            ? <SelectInput
              value={newRule.dayOfWeek}
              placeholder="Select a day..."
              onChange={(e) =>
                dispatch({
                  type: "SET_NEW_RULE_FIELD",
                  field: "dayOfWeek",
                  value: e.target.value,
                })
              }
              options={[0, 1, 2, 3, 4, 5, 6].map((day) => ({ value: day, label: getDayName(day) }))}
            />
            : <Input
              type="Date"
              label="Day of Month"
              value={newRule.dayOfMonth}
              onChange={(e) =>
                dispatch({
                  type: "SET_NEW_RULE_FIELD",
                  field: "date",
                  value: Number(e.target.value),
                })
              }
            />
        }


        <Input
          type="number"
          label="Default Price per Slot"
          value={newRule.defaultPricePerSlot}
          onChange={(e) =>
            dispatch({
              type: "SET_NEW_RULE_FIELD",
              field: "defaultPricePerSlot",
              value: Number(e.target.value),
            })
          }
          min={0}
        />
      </div>
      <div className="flex items-center mb-6">
        <input
          type="checkbox"
          checked={newRule.isFixedHourly}
          onChange={(e) =>
            dispatch({
              type: "SET_NEW_RULE_FIELD",
              field: "isFixedHourly",
              value: e.target.checked,
            })
          }
          className="w-5 h-5 text-rose-500 rounded"
        />
        <label className="ml-3 text-gray-700">Fixed Hourly Rate</label>
      </div>
      {!newRule.isFixedHourly && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-medium text-gray-800 mb-4">
            Add Discounts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              type="number"
              label="Number of Slots"
              value={newRule.newSlotCount}
              onChange={(e) =>
                dispatch({
                  type: "SET_NEW_RULE_FIELD",
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
              value={newRule.newDiscountPercent}
              onChange={(e) =>
                dispatch({
                  type: "SET_NEW_RULE_FIELD",
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
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Add Discount
          </button>
          {Object.entries(newRule.perSlotDiscounts).length > 0 && (
            <div className="mt-4 space-y-3">
              {Object.entries(newRule.perSlotDiscounts).map(([slots, discount]) => (
                <div
                  key={slots}
                  className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg text-gray-700"
                >
                  <span>
                    {slots} slots:
                    <span className="font-semibold ml-2 text-rose-500">{discount}% discount</span>
                  </span>
                  <button
                    onClick={() => handleRemoveDiscountFromNewRule(slots)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <button
        onClick={handleAddPriceRule}
        className="w-full px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm mt-6"
      >
        Create Price Rule
      </button>
    </div>
  </motion.div>
);

export {
  PriceRuleList,
  PriceRuleCard,
  DiscountList,
  ActionButtons,
  RuleDisplay,
  NewPriceRuleForm
};