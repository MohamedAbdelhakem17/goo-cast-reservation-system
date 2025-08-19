export default function usePriceFormat() {
  return (price) => {
    if (typeof price !== "number" || isNaN(price) || price < 0) {
      price = 0;
    }

    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(price);
  };
}
