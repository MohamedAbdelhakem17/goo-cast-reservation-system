import { Input } from "@/components/common";
import { motion } from "framer-motion";

export default function FacilitiesInput({ form }) {
  const handleAddFacility = () => {
    const cf = form.values.currentFacility?.trim();
    if (cf) {
      form.setFieldValue("facilities", [...form.values.facilities, cf]);
      form.setFieldValue("currentFacility", "");
    }
  };

  const handleRemoveFacility = (index) => {
    const arr = form.values.facilities.filter((_, i) => i !== index);
    form.setFieldValue("facilities", arr);
  };
  return (
    <div className="w-full rounded-lg bg-gray-50 p-4">
      <label className="mb-4 block text-sm font-medium text-gray-700">Facilities</label>
      <div className="mb-2 flex w-full items-center gap-5">
        <Input
          value={form.values.currentFacility}
          id="currentFacility"
          name="currentFacility"
          onChange={form.handleChange}
          placeholder="Enter facility"
          className="w-full"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddFacility();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddFacility}
          className="bg-main hover:bg-main/70 flex size-10 items-center justify-center rounded-md p-4 text-white transition"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      <div className="mb-2 flex flex-wrap gap-2">
        {form.values.facilities.map((facility, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1"
          >
            <span className="text-sm">{facility}</span>
            <button
              type="button"
              onClick={() => handleRemoveFacility(index)}
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
