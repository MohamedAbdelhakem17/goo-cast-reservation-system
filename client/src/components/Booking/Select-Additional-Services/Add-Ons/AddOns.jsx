import { motion } from "framer-motion";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";
import { GetAllAddOns } from "../../../../apis/services/services.api";
import Loading from "../../../shared/Loading/Loading";

export default function AddOns() {
  const { data: addOns, isLoading } = GetAllAddOns();
  const { bookingData, setBookingField } = useBooking();

  const handleAddOnChange = (id, name, quantity, price) => {
    let updatedAddOns = [...bookingData.selectedAddOns];

    const index = updatedAddOns.findIndex((addon) => addon.id === id);

    if (quantity === 0 && index !== -1) {
      updatedAddOns.splice(index, 1);
    } else if (index !== -1) {
      updatedAddOns[index].quantity = quantity;
      updatedAddOns[index].totalPrice = price * quantity; 
    } else {
      updatedAddOns.push({
        id,
        name,
        quantity,
        price,
      });
    }
    setBookingField("selectedAddOns", updatedAddOns);
  };

  const getQuantity = (id) => {
    const found = bookingData.selectedAddOns.find((item) => item.id === id);
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

  // Animation Variants
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
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {addOns?.data?.map((addon) => {
          const quantity = getQuantity(addon.id);
          return (
            <motion.div
              key={addon.id}
              variants={cardVariants}
              className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-col justify-between transition-transform hover:scale-[1.02] duration-300"
            >

              <div className="w-full h-40 overflow-hidden">
                <img
                  src={addon.image}
                  alt={addon.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="flex flex-col flex-grow p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {addon.name}
                </h3>

                <p className="text-sm text-gray-600 flex-grow">
                  {addon.description}
                </p>

                <div className="pt-4 mt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-800">
                    {addon.price.toLocaleString()} EGP
                  </span>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-700"
                      onClick={() =>
                        handleDecrement(addon.id, addon.name, addon.price)
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
                        handleIncrement(addon.id, addon.name, addon.price)
                      }
                    >
                      <i className="fa-solid fa-plus text-sm"></i>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
}
