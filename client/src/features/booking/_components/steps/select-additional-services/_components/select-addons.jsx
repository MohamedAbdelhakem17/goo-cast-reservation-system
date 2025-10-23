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
    <motion.div
      className="grid w-full grid-cols-1 gap-6 px-2 sm:grid-cols-2 sm:px-4 lg:px-0 xl:grid-cols-2"
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
            className={`flex flex-col justify-between overflow-hidden rounded-2xl border bg-gray-50 shadow-sm transition-transform duration-300 hover:shadow-2xl ${
              isSelected ? "border-main shadow-main/10" : "border-gray-100"
            } `}
          >
            {/* === Image === */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl p-2">
              <img
                src={addon.image}
                alt={addon.name?.[lng]}
                className="h-full w-full rounded-2xl object-cover transition-transform duration-300 hover:scale-95"
              />
            </div>

            {/* === Info === */}
            <div className="flex flex-grow flex-col gap-y-3 p-4">
              {/* Title */}
              <h3 className="text-lg font-semibold text-black">{addon.name?.[lng]}</h3>

              {/* Description */}
              <p className="flex-grow text-sm leading-relaxed text-gray-600">
                {addon.description?.[lng]}
              </p>

              {/* Price */}
              <div className="text-md flex w-fit items-center justify-center rounded-lg p-1 font-bold text-gray-800">
                {priceFormat(addon.price)}
              </div>

              {/* === Actions === */}
              <div className="mt-2">
                {quantity === 0 ? (
                  <button
                    className="text-md w-full rounded-lg bg-black px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-gray-800"
                    onClick={() => handleIncrement(addon._id, addon.name, addon.price)}
                  >
                    {t("add-to-cart")}
                  </button>
                ) : (
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
                      className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
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
  );
}
