import { Input } from "@/components/common";
import { motion } from "framer-motion";
import useLocalization from "@/context/localization-provider/localization-context";

export default function MultiLangArrayInput({
  form,
  fieldName,
  lang,
  labelKey,
  placeholderKey,
}) {
  const { t } = useLocalization();

  const handleAddItem = () => {
    const currentValue = form.values[`current_${fieldName}`]?.trim();
    if (currentValue) {
      const updated = {
        ar: [...form.values[fieldName]?.ar],
        en: [...form.values[fieldName]?.en],
      };
      // Split by comma and add each item separately
      const items = currentValue.split(',').map(item => item.trim()).filter(item => item);
      updated[lang].push(...items);
      form.setFieldValue(fieldName, updated);
      form.setFieldValue(`current_${fieldName}`, "");
    }
  };

  const handleRemoveItem = (index) => {
    const updated = {
      ar: [...form.values[fieldName].ar],
      en: [...form.values[fieldName].en],
    };
    updated[lang] = updated[lang].filter((_, i) => i !== index);
    form.setFieldValue(fieldName, updated);
  };

  const error = form.touched[fieldName]?.[lang] && form.errors[fieldName]?.[lang];

  return (
    <div className="my-2 w-full rounded-lg bg-gray-50 p-4">
      <div className="mb-2 flex w-full items-center gap-5">
        <Input
          value={form.values[`current_${fieldName}`]}
          id={`current_${fieldName}`}
          label={`${t(labelKey)} (${lang.toUpperCase()})`}
          name={`current_${fieldName}`}
          onChange={form.handleChange}
          placeholder={t(placeholderKey)}
          className="w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddItem();
            }
          }}
        />

        <button
          type="button"
          onClick={handleAddItem}
          className="bg-main hover:bg-main/70 flex size-10 items-center justify-center rounded-md p-4 text-white transition"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="mb-2 flex flex-wrap gap-2">
        {form.values[fieldName]?.[lang].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1"
          >
            <span className="text-sm">{item}</span>
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
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
