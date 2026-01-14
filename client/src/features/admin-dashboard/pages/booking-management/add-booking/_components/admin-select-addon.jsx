import { useGetAddons } from "@/apis/admin/manage-addons.api";
import { Loading } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useAddOnsManager } from "@/hooks/use-addons-manger";
import usePriceFormat from "@/hooks/usePriceFormat";
import { PackagePlus, Trash } from "lucide-react";

export default function AdminSelectAddon({ bookingData, setBookingField }) {
  // Localization
  const { t, lng } = useLocalization();

  // Query
  const { addons, isLoading } = useGetAddons(true);

  // Hooks
  const priceFormat = usePriceFormat();

  const { handleIncrement, handleDecrement, handleRemove, getQuantity } =
    useAddOnsManager({ bookingData, setBookingField, addons });

  // Loading State
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <h3 className="flex items-center text-2xl font-bold">
        <PackagePlus className="text-main me-2" />
        {t("additional-services")}
      </h3>

      {/* Addons */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
        {addons?.data.map(({ name, _id, price }) => {
          const quantity = getQuantity(_id);
          return (
            <div
              key={_id}
              className="group hover:border-main relative col-span-1 cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Title */}
              <h2 className="group-hover:text-main mb-1 text-lg font-semibold text-gray-800">
                {name?.[lng]}
              </h2>

              {/* Price */}
              <div className="mt-4 flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-900">{priceFormat(price)}</p>
                <span className="text-sm text-gray-500">/ {t("hour")}</span>
              </div>

              {/* Quantity Selector */}
              <div className="mt-5 flex items-center justify-between gap-x-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md">
                {/* Remove Button */}
                {quantity > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(_id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500 text-white transition hover:bg-red-600 active:scale-95"
                    title="Remove item"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                )}

                {/* Counter Section */}
                <div className="flex flex-1 items-center justify-between gap-3">
                  {/* Decrement */}
                  <button
                    type="button"
                    onClick={() => handleDecrement(_id, name, price)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold text-gray-700 transition hover:bg-gray-200 active:scale-95"
                  >
                    −
                  </button>

                  {/* Quantity */}
                  <span className="min-w-[2rem] text-center text-lg font-semibold text-gray-900">
                    {quantity}
                  </span>

                  {/* Increment */}
                  <button
                    type="button"
                    onClick={() => handleIncrement(_id, name, price)}
                    className="bg-main hover:bg-main/90 flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold text-white transition active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Decorative Bottom Bar */}
              <div className="bg-main absolute bottom-0 left-0 h-1 w-0 rounded-r-full transition-all duration-300 group-hover:w-full"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
