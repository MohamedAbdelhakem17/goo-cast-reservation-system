import useLocalization from "@/context/localization-provider/localization-context";
export default function usePriceFormat() {
  const { lng } = useLocalization();
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
