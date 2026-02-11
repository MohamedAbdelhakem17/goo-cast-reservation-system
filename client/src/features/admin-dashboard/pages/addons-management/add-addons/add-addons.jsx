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

  // Helper function to flatten errors
  const getErrorMessages = (errors) => {
    const messages = [];

    const flattenErrors = (obj, prefix = "") => {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const fieldName = prefix ? `${prefix}.${key}` : key;

        if (typeof value === "string") {
          messages.push({ field: fieldName, message: value });
        } else if (typeof value === "object" && value !== null) {
          flattenErrors(value, fieldName);
        }
      });
    };

    flattenErrors(errors);
    return messages;
  };

  const errorMessages = getErrorMessages(form.errors);

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

        {/* Validation Errors - Modern UI */}
        {errorMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-2 rounded-lg border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-orange-50 p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-base font-semibold text-red-800">
                  Please fix the following {errorMessages.length}{" "}
                  {errorMessages.length === 1 ? "error" : "errors"}:
                </h3>
                <ul className="space-y-1.5">
                  {errorMessages.map((error, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-red-700"
                    >
                      <span className="mt-0.5 font-bold text-red-500">•</span>
                      <span>
                        <span className="font-medium capitalize">
                          {error.field.replace(/\./g, " → ")}
                        </span>
                        : {error.message}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit */}
        <div className="col-span-2">
          <Button
            isPending={isLoading}
            fallback={t("processing-0")}
            type="submit"
            className="w-full"
          >
            {isEdit ? t("update-addon") : t("add-addon")}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
