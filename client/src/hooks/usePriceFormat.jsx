import useLocalization from "@/context/localization-provider/localization-context";

export default function usePriceFormat() {
  let lng = "en";

  try {
    const localization = useLocalization();
    if (localization && localization.lng) {
      lng = localization.lng;
    }
  } catch (err) {
    lng = "en";
  }

  return (price) => {
    if (typeof price !== "number" || isNaN(price) || price < 0) {
      price = 0;
    }

    return new Intl.NumberFormat(`${lng}-EG`, {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(price);
  };
}
