import { useCallback } from "react";

export const useAddOnsManager = ({
  bookingData,
  setBookingField,
  addons,
  tracking,
  lng,
}) => {
  // Update addons Quantity
  const handleAddOnChange = useCallback(
    (id, name, quantity, price) => {
      let updatedAddOns = [...(bookingData.selectedAddOns || [])];
      const index = updatedAddOns.findIndex((addon) => addon.id === id);
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
          id,
          name,
          quantity,
          price,
          totalPrice: price * quantity,
        });
      }

      setBookingField("selectedAddOns", updatedAddOns);
    },
    [bookingData?.selectedAddOns, setBookingField],
  );

  // Return Quantity
  const getQuantity = useCallback(
    (id) => {
      const found = bookingData?.selectedAddOns.find((item) => item.id === id);
      return found ? found.quantity : 0;
    },
    [bookingData?.selectedAddOns],
  );

  // handel increment addons
  const handleIncrement = useCallback(
    (id, name, price, unit) => {
      const currentQty = getQuantity(id);
      const addonPrice = unit === "hour" ? price * bookingData?.duration : price;
      console.log(
        "Addon Price:",
        addonPrice,
        "Unit:",
        unit,
        "Duration:",
        bookingData?.duration,
      );
      if (tracking) {
        tracking("add-addon", {
          addon_name: name?.[lng] || name,
          addon_price: addonPrice,
          addon_quantity: currentQty + 1,
        });
      }
      handleAddOnChange(id, name, currentQty + 1, addonPrice);
    },
    [getQuantity, handleAddOnChange, tracking, lng],
  );

  // Handel decrement select addons
  const handleDecrement = useCallback(
    (id, name, price) => {
      const currentQty = getQuantity(id);
      if (tracking) {
        // tracking("remove_from_cart", {
        //   addon_name: name?.[lng] || name,
        //   addon_price: price,
        //   addon_quantity: 1,
        // });
      }
      if (currentQty > 0) {
        handleAddOnChange(id, name, currentQty - 1, price);
      }
    },
    [getQuantity, handleAddOnChange, tracking, lng],
  );

  // Handel remove addons
  const handleRemove = useCallback(
    (id) => {
      const addon = addons?.data?.find((item) => item._id === id);
      if (addon) {
        handleAddOnChange(id, addon.name, 0, addon.price);
        if (tracking) {
          tracking("remove_from_cart", {
            addon_name: addon.name?.[lng] || addon.name,
            addon_price: addon.price,
          });
        }
      }
    },
    [addons, handleAddOnChange, tracking, lng],
  );

  return {
    handleIncrement,
    handleDecrement,
    handleRemove,
    getQuantity,
  };
};
