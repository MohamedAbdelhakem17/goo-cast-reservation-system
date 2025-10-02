import useLocalization from "@/context/localization-provider/localization-context";

export default function useNumberFormat() {
  const { lng } = useLocalization();
  return (value) => new Intl.NumberFormat(`${lng}-EG`).format(value);
}
