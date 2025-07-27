import { motion } from "framer-motion";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";
import { GetAllAddOns } from "../../../../apis/services/services.api";
import Loading from "../../../shared/Loading/Loading";
import { useCallback } from "react";
import usePriceFormat from "../../../../hooks/usePriceFormat";

export default function AddOns() {
  const { data: addOns, isLoading } = GetAllAddOns();
  const { bookingData, setBookingField } = useBooking();

  const priceFormat = usePriceFormat();

  const handleAddOnChange = useCallback((id, name, quantity, price) => {
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
  }, [bookingData.selectedAddOns, setBookingField]);

  const getQuantity = (id) => {
    const found = bookingData.selectedAddOns.find((item) => item._id === id);
    return found ? found.quantity : 0;
  };

  const handleIncrement = (id, name, price) => {
    const currentQty = getQuantity(id);
    handleAddOnChange(id, name, currentQty + 1, price);
  };

  const handleDecrement = (id, name, price) => {
    const currentQty = getQuantity(id);
    if (currentQty > 0) {
      handleAddOnChange(id, name, currentQty - 1, price);
    }
  };

  const handleRemove = (id) => {
    const addon = addOns?.data?.find((item) => item._id === id);
    if (addon) {
      handleAddOnChange(id, addon.name, 0, addon.price);
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
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
              className={`bg-white rounded-xl overflow-hidden shadow-sm border flex flex-col justify-between transition-transform hover:scale-[1.02] duration-300 ${isSelected ? 'border-main' : 'border-gray-300'
                }`}
            >
              <div className="w-full h-40 overflow-hidden p-4 relative">
                <div className="p-1 w-fit bg-black/70 text-white rounded-lg text-sm flex items-center justify-center top-6 right-4 absolute">
                  {priceFormat(addon.price)}
                </div>
                <img
                  src={addon.image}
                  alt={addon.name}
                  className="w-full  h-full object-cover  transition-transform duration-300 rounded-md"
                />
              </div>

              <div className="flex flex-col flex-grow py-1 px-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {addon.name}
                </h3>

                <p className="text-sm text-gray-600 flex-grow">
                  {addon.description}
                </p>

                <div>
                  {quantity === 0 && (
                    <button
                      className="w-full py-2 px-4 rounded-lg mx-auto text-md font-semibold flex items-center justify-center bg-main text-white my-2"
                      onClick={() =>
                        handleIncrement(addon._id, addon.name, addon.price)
                      }
                    >
                      Add to cart
                    </button>
                  )}

                  {quantity > 0 && (
                    <div className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 border border-gray-200 text-black rounded-md flex items-center justify-center"
                          onClick={() =>
                            handleDecrement(addon._id, addon.name, addon.price)
                          }
                          disabled={quantity === 0}
                        >
                          <i className="fa-solid fa-minus text-sm"></i>
                        </motion.button>

                        <span className="w-8 text-center font-medium">
                          {quantity}
                        </span>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 border border-gray-200 text-black rounded-md flex items-center justify-center"
                          onClick={() =>
                            handleIncrement(addon._id, addon.name, addon.price)
                          }
                        >
                          <i className="fa-solid fa-plus text-sm"></i>
                        </motion.button>
                      </div>

                      <button
                        className="text-sm  rounded border border-gray-300 px-2 py-1"
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



{/* <div className="pt-4 mt-4  flex items-center justify-between">
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
                </div> */}