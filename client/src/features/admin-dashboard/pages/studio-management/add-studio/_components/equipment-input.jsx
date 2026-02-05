import { Input } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { motion } from "framer-motion";

export default function EquipmentInput({ form, lang }) {
  const { t } = useLocalization();

  const handleAddEquipment = () => {
    const ce = form.values.currentEquipment?.trim();
    if (ce) {
      const equipment = {
        ar: [...form.values.equipment?.ar],
        en: [...form.values.equipment?.en],
      };
      equipment[lang].push(ce);
      form.setFieldValue("equipment", equipment);
      form.setFieldValue("currentEquipment", "");
      // Mark field as touched to trigger validation
      form.setFieldTouched(`equipment.${lang}`, true, true);
    }
  };

  const handleRemoveEquipment = (index) => {
    const equipment = {
      ar: [...form.values.equipment.ar],
      en: [...form.values.equipment.en],
    };
    equipment[lang] = equipment[lang].filter((_, i) => i !== index);
    form.setFieldValue("equipment", equipment);
    // Mark field as touched to trigger validation
    form.setFieldTouched(`equipment.${lang}`, true, true);
  };

  const equipmentError = form.touched.equipment?.[lang] && form.errors.equipment?.[lang];

  return (
    <div className="my-2 w-full rounded-lg bg-gray-50 p-4">
      <div className="mb-2 flex w-full items-center gap-5">
        <Input
          value={form.values.currentEquipment}
          id="currentEquipment"
          label={`${t("equipment")} (${lang.toUpperCase()})`}
          name="currentEquipment"
          onChange={form.handleChange}
          placeholder={t("enter-equipment")}
          className="w-full"
          onKeyDown={(e) => {
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

      {equipmentError && <p className="text-sm text-red-500">{equipmentError}</p>}

      <div className="mb-2 flex flex-wrap gap-2">
        {form.values.equipment?.[lang].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1"
          >
            <span className="text-sm">{item}</span>
            <button
              type="button"
              onClick={() => handleRemoveEquipment(index)}
              className="text-main"
            >
              ×
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
