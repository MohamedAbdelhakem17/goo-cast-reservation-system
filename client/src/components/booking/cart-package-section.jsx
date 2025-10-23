import { memo } from "react";

const PackageSection = memo(function PackageSection({
  selectedPackage,
  duration,
  priceFormat,
  lng,
}) {
  if (!selectedPackage || Object.keys(selectedPackage).length === 0) return null;

  return (
    <div className="flex items-center justify-between py-1">
      <p className="text-md text-gray-500">{selectedPackage.name?.[lng]}</p>
      <p className="text-md text-gray-500">
        {priceFormat(selectedPackage.price)} x {duration} {lng === "ar" ? "ساعة" : "h"}
      </p>
    </div>
  );
});

export default PackageSection;
