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
    (id, name, quantity, price, unit, basePrice) => {
      let updatedAddOns = [...(bookingData.selectedAddOns || [])];
      const index = updatedAddOns.findIndex((addon) => addon.id === id);
      if (quantity === 0 && index !== -1) {
        updatedAddOns.splice(index, 1);
      } else if (index !== -1) {
        updatedAddOns[index] = {
          ...updatedAddOns[index],
          quantity,
          totalPrice: price * quantity,
          price,
          unit,
          basePrice,
        };
      } else {
        updatedAddOns.push({
          id,
          name,
          quantity,
          price,
          totalPrice: price * quantity,
          unit,
          basePrice,
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

      if (tracking) {
        tracking("add-addon", {
          addon_name: name?.[lng] || name,
          addon_price: addonPrice,
          addon_quantity: currentQty + 1,
        });
      }
      handleAddOnChange(id, name, currentQty + 1, addonPrice, unit, price);
    },
    [getQuantity, handleAddOnChange, tracking, lng, bookingData?.duration],
  );

  // Handel decrement select addons
  const handleDecrement = useCallback(
    (id, name, basePrice, unit) => {
      const currentQty = getQuantity(id);
      if (tracking) {
        // tracking("remove_from_cart", {
        //   addon_name: name?.[lng] || name,
        //   addon_price: price,
        //   addon_quantity: 1,
        // });
      }
      if (currentQty > 0) {
        // Get the current calculated price from selected addons
        const selectedAddon = bookingData?.selectedAddOns?.find(
          (addon) => addon.id === id,
        );
        const currentPrice =
          selectedAddon?.price ||
          (unit === "hour" ? basePrice * bookingData?.duration : basePrice);
        handleAddOnChange(id, name, currentQty - 1, currentPrice, unit, basePrice);
      }
    },
    [
      getQuantity,
      handleAddOnChange,
      tracking,
      lng,
      bookingData?.selectedAddOns,
      bookingData?.duration,
    ],
  );

  // Handel remove addons
  const handleRemove = useCallback(
    (id) => {
      const addon = addons?.data?.find((item) => item._id === id);
      if (addon) {
        handleAddOnChange(id, addon.name, 0, addon.price, addon.unit, addon.price);
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
