import useLocalization from "@/context/localization-provider/localization-context";
import usePriceFormat from "@/hooks/usePriceFormat";
import { useGetAllPackages } from "@/apis/admin/manage-package.api";
import { Loading } from "@/components/common";
import { Blocks } from "lucide-react";

export default function AdminSelectPackage({ selectPackage, selectedPackage }) {
  // Localization
  const { t, lng } = useLocalization();

  // Query
  const { packages, isLoading } = useGetAllPackages(true);

  // Hooks
  const priceFormat = usePriceFormat();

  // function
  const handleSelectPackage = ({ _id, name, price }) => {
    selectPackage("selectedPackage", {
      id: _id,
      name,
      price,
    });
  };

  // Loading State
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <h3 className="flex items-center text-2xl font-bold">
        <Blocks className="text-main me-2" />
        {t("select-service")}
      </h3>

      {/* Services */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
        {packages?.data.map(({ name, _id, price, session_type }) => {
          const selectedPkg = selectedPackage === _id;
          return (
            <div
              onClick={() => handleSelectPackage({ name, _id, price })}
              key={_id}
              className={`${selectedPkg && "border-main scale-90 border"} group hover:border-main relative col-span-1 cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              {/* Title */}
              <h2 className="group-hover:text-main mb-1 text-lg font-semibold text-gray-800">
                {name?.[lng]}
              </h2>

              {/* Session Type */}
              <span className="border-main bg-main/10 text-main inline-block rounded-full border px-3 py-0.5 text-xs font-medium">
                {session_type?.[lng]}
              </span>

              {/* Price */}
              <div className="mt-4 flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-900">{priceFormat(price)}</p>
                <span className="text-sm text-gray-500">/ {t("hour")}</span>
              </div>

              {/* Decorative Bottom Bar */}
              <div
                className={`${selectedPkg && "w-full"} bg-main absolute bottom-0 left-0 h-1 w-0 rounded-r-full transition-all duration-300 group-hover:w-full`}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
