import { Input } from "@/components/common";

export default function PriceTab({ setFieldValue, totalPrice }) {
  // Function
  const handelChancePrice = (e) => {
    const newPrice = e.target.value;

    setFieldValue("totalPrice", Number(newPrice));
  };

  return (
    <Input
      value={totalPrice}
      label={"Total Price"}
      id="totalPrice"
      onChange={handelChancePrice}
    />
  );
}
