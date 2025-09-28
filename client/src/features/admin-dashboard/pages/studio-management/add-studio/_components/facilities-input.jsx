import { Input } from "@/components/common";
import { motion } from "framer-motion";
import useLocalization from "@/context/localization-provider/localization-context";

export default function FacilitiesInput({ form, lang }) {
  const { t } = useLocalization();

  const handleAddFacility = () => {
    const cf = form.values.currentFacility?.trim();
    if (cf) {
      const facilities = {
        ar: [...form.values.facilities?.ar],
        en: [...form.values.facilities?.en],
      };
      facilities[lang].push(cf);
      form.setFieldValue("facilities", facilities);
      form.setFieldValue("currentFacility", "");
    }
  };

  const handleRemoveFacility = (index) => {
    const facilities = {
      ar: [...form.values.facilities.ar],
      en: [...form.values.facilities.en],
    };
    facilities[lang] = facilities[lang].filter((_, i) => i !== index);
    form.setFieldValue("facilities", facilities);
  };

  const facilitiesError =
    form.touched.facilities?.[lang] && form.errors.facilities?.[lang];

  return (
    <div className="my-2 w-full rounded-lg bg-gray-50 p-4">
      <div className="mb-2 flex w-full items-center gap-5">
        <Input
          value={form.values.currentFacility}
          id="currentFacility"
          label={`${t("facilities")} (${lang.toUpperCase()})`}
          name="currentFacility"
          onChange={form.handleChange}
          placeholder={t("enter-facility")}
          className="w-full"
          onKeyDown={(e) => {
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

      {facilitiesError && <p className="text-sm text-red-500">{facilitiesError}</p>}

      <div className="mb-2 flex flex-wrap gap-2">
        {form.values.facilities?.[lang].map((facility, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1"
          >
            <span className="text-sm">{facility}</span>
            <button
              type="button"
              onClick={() => handleRemoveFacility(index)}
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
