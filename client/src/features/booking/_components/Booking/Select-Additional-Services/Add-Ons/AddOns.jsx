import { motion } from "framer-motion";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import { GetAllAddOns } from "@/apis/services/services.api";
import { useCallback } from "react";
import usePriceFormat from "@/hooks/usePriceFormat";
import { tracking } from "@/utils/gtm";
import { Loading } from "@/components/common";

export default function AddOns() {
  const { data: addOns, isLoading } = GetAllAddOns();
  const { bookingData, setBookingField } = useBooking();

  const priceFormat = usePriceFormat();

  const handleAddOnChange = useCallback(
    (id, name, quantity, price) => {
      let updatedAddOns = [...bookingData.selectedAddOns];
      const index = updatedAddOns.findIndex((addon) => addon._id === id);

      if (quantity === 0 && index !== -1) {
        updatedAddOns.splice(index, 1);
      } else if (index !== -1) {
        updatedAddOns[index] = {
          ...updatedAddOns[index],
          quantity,
          totalPrice: price * quantity,
        };
      } else {
        updatedAddOns.push({
          _id: id,
          name,
          quantity,
          price,
          totalPrice: price * quantity,
        });
      }

      setBookingField("selectedAddOns", updatedAddOns);
    },
    [bookingData.selectedAddOns, setBookingField],
  );

  const getQuantity = (id) => {
    const found = bookingData.selectedAddOns.find((item) => item._id === id);
    return found ? found.quantity : 0;
  };

  const handleIncrement = (id, name, price) => {
    const currentQty = getQuantity(id);
    tracking("add_to_cart ", {
      addon_name: name,
      addon_price: price,
      addon_quantity: currentQty + 1,
    });
    handleAddOnChange(id, name, currentQty + 1, price);
  };

  const handleDecrement = (id, name, price) => {
    const currentQty = getQuantity(id);
    tracking("remove_from_cart ", {
      addon_name: name,
      addon_price: price,
      addon_quantity: 1,
    });
    if (currentQty > 0) {
      handleAddOnChange(id, name, currentQty - 1, price);
    }
  };

  const handleRemove = (id) => {
    const addon = addOns?.data?.find((item) => item._id === id);
    if (addon) {
      handleAddOnChange(id, addon.name, 0, addon.price);
      tracking("remove_from_cart ", { addon_name: addon.name, addon_price: addon.price });
    }
  };

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

  if (isLoading) return <Loading />;

  return (
    <>
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {addOns?.data?.map((addon) => {
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
              <div className="relative h-80 w-full overflow-hidden p-4">
                <img
                  src={addon.image}
                  alt={addon.name}
                  className="h-full w-full rounded-md object-cover transition-transform duration-300"
                />
              </div>

              <div className="flex flex-grow flex-col px-4 py-1">
                <h3 className="mb-1 text-lg font-semibold text-gray-900">{addon.name}</h3>

                <p className="flex-grow text-sm text-gray-600">{addon.description}</p>

                <div className="text-md top-6 right-4 flex w-fit items-center justify-center rounded-lg p-1 font-bold">
                  {priceFormat(addon.price)}
                </div>

                <div>
                  {quantity === 0 && (
                    <button
                      className="text-md bg-main mx-auto my-2 flex w-full items-center justify-center rounded-lg px-4 py-2 font-semibold text-white"
                      onClick={() => handleIncrement(addon._id, addon.name, addon.price)}
                    >
                      Add to cart
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
                        Remove
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

{
  /* <div className="pt-4 mt-4  flex items-center justify-between">
                  <span className="text-base font-bold text-gray-800">
                    {addon.price.toLocaleString()} EGP
                  </span>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-700"
                      onClick={() =>
                        handleDecrement(addon._id, addon.name, addon.price)
                      }
                      disabled={quantity === 0}
                    >
                      <i className="fa-solid fa-minus text-sm"></i>
                    </motion.button>

                    <span className="w-8 text-center font-medium text-gray-700">
                      {quantity}
                    </span>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-main hover:bg-main text-white rounded-full flex items-center justify-center"
                      onClick={() =>
                        handleIncrement(addon._id, addon.name, addon.price)
                      }
                    >
                      <i className="fa-solid fa-plus text-sm"></i>
                    </motion.button>
                  </div>
                </div> */
}
