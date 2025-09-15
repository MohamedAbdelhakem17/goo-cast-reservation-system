import { Input } from "@/components/common";
import { motion } from "framer-motion";

export default function EquipmentInput({ form }) {
  const handleAddEquipment = () => {
    const ce = form.values.currentEquipment?.trim();
    if (ce) {
      form.setFieldValue("equipment", [...form.values.equipment, ce]);
      form.setFieldValue("currentEquipment", "");
    }
  };

  const handleRemoveEquipment = (index) => {
    const arr = form.values.equipment.filter((_, i) => i !== index);
    form.setFieldValue("equipment", arr);
  };

  return (
    <div className="w-full rounded-lg bg-gray-50 p-4">
      <label className="mb-4 block text-sm font-medium text-gray-700">Equipment</label>
      <div className="mb-2 flex w-full items-center gap-5">
        <Input
          value={form.values.currentEquipment}
          name="currentEquipment"
          id="currentEquipment"
          onChange={form.handleChange}
          placeholder="Enter equipment"
          className="w-full"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddEquipment();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddEquipment}
          className="bg-main hover:bg-main/70 flex size-10 items-center justify-center rounded-md p-4 text-white transition"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      <div className="mb-2 flex flex-wrap gap-2">
        {form.values.equipment.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1"
          >
            <span className="text-sm">{item}</span>
            <button
              type="button"
              onClick={() => handleRemoveEquipment(index)}
              className="text-red-500 opacity-0 transition group-hover:opacity-100"
            >
              ×
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
