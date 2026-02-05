import { useGetSingleAddon } from "@/apis/admin/manage-addons.api";
import { useGetAllPackages } from "@/apis/admin/manage-package.api";
import { Button } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { AddonBasicFields, AddonImageUpload, RecommendationSettings } from "./components";
import { useAddonForm, usePackageOptions } from "./hooks";

export default function AddAddons() {
  const { t, lng } = useLocalization();
  const [searchParams] = useSearchParams();
  const addonId = searchParams.get("edit");
  const isEdit = Boolean(addonId);

  // Fetch data
  const { singleAddon } = useGetSingleAddon(addonId);
  const { packages } = useGetAllPackages("all");

  // Custom hooks
  const packageOptions = usePackageOptions(packages, lng);
  const { form, isLoading } = useAddonForm(isEdit, singleAddon, t);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ms:p-8 container mx-auto scale-[.95]"
    >
      <h2 className="border-main mb-4 rounded-md border-b py-2 text-center text-3xl font-bold text-gray-800">
        {isEdit ? t("edit-addon") : t("add-new-addons")}
      </h2>

      <form
        onSubmit={form.handleSubmit}
        className="grid gap-8 rounded-md bg-white px-4 py-8 shadow md:grid-cols-2"
      >
        <AddonBasicFields form={form} t={t} />

        <AddonImageUpload form={form} t={t} />

        <RecommendationSettings form={form} packageOptions={packageOptions} t={t} />

        {/* Submit */}
        <div className="col-span-2">
          <Button isPending={isLoading} fallback={t("processing-0")}>
            {isEdit ? t("update-addon") : t("add-addon")}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
