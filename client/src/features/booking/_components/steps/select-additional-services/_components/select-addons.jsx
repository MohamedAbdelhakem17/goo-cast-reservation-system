import { motion } from "framer-motion";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import { useCallback } from "react";
import usePriceFormat from "@/hooks/usePriceFormat";
import { tracking } from "@/utils/gtm";
import { Loading } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useGetAddons } from "@/apis/admin/manage-addons.api";
import { useAddOnsManager } from "@/hooks/use-addons-manger";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50 },
  },
};

export default function AddOns() {
  // Localization
  const { t, lng } = useLocalization();

  // Query
  const { addons, isLoading } = useGetAddons(true);

  // Hooks
  const { bookingData, setBookingField } = useBooking();

  const { handleIncrement, handleDecrement, handleRemove, getQuantity } =
    useAddOnsManager({
      bookingData,
      setBookingField,
      addons,
      tracking,
      lng,
    });
  const priceFormat = usePriceFormat();

  if (isLoading) return <Loading />;

  return (
    <>
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {addons?.data?.map((addon) => {
          const quantity = getQuantity(addon._id);
          const isSelected = quantity > 0;

          return (
            <motion.div
              key={addon._id}
              variants={cardVariants}
              className={`flex flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-sm transition-transform duration-300 hover:scale-[1.02] ${
                isSelected ? "border-main" : "border-gray-300"
              }`}
            >
              <div className="relative h-80 w-full overflow-hidden p-1">
                <img
                  src={addon.image}
                  alt={addon.name?.[lng]}
                  className="h-full w-full rounded-md object-cover transition-transform duration-300"
                />
              </div>

              <div className="flex flex-grow flex-col px-4 py-1">
                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                  {addon.name?.[lng]}
                </h3>
                <p className="flex-grow text-sm text-gray-600">
                  {addon.description?.[lng]}
                </p>

                <div className="text-md top-6 right-4 flex w-fit items-center justify-center rounded-lg p-1 font-bold">
                  {priceFormat(addon.price)}
                </div>

                <div>
                  {quantity === 0 && (
                    <button
                      className="text-md bg-main mx-auto my-2 flex w-full items-center justify-center rounded-lg px-4 py-2 font-semibold text-white"
                      onClick={() => handleIncrement(addon._id, addon.name, addon.price)}
                    >
                      {t("add-to-cart")}
                    </button>
                  )}

                  {quantity > 0 && (
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-black"
                          onClick={() =>
                            handleDecrement(addon._id, addon.name, addon.price)
                          }
                          disabled={quantity === 0}
                        >
                          <i className="fa-solid fa-minus text-sm"></i>
                        </motion.button>

                        <span className="w-8 text-center font-medium">{quantity}</span>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-black"
                          onClick={() =>
                            handleIncrement(addon._id, addon.name, addon.price)
                          }
                        >
                          <i className="fa-solid fa-plus text-sm"></i>
                        </motion.button>
                      </div>

                      <button
                        className="rounded border border-gray-300 px-2 py-1 text-sm"
                        onClick={() => handleRemove(addon._id)}
                      >
                        {t("remove")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
}
