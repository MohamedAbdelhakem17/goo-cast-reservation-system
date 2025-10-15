import { memo } from "react";

const AddOnsSection = memo(function AddOnsSection({ selectedAddOns, priceFormat, lng }) {
  if (!selectedAddOns || selectedAddOns.length === 0) return null;

  console.log({ "select addons": selectedAddOns });
  return (
    <ul className="pb-2">
      {selectedAddOns.map((addon) => (
        <li className="flex items-center justify-between py-1" key={addon?._id}>
          <p className="text-md text-gray-500">{addon.name?.[lng]}</p>
          <p className="text-md text-gray-500">
            {priceFormat(addon.price)} / x{addon.quantity}
          </p>
        </li>
      ))}
    </ul>
  );
});

export default AddOnsSection;
