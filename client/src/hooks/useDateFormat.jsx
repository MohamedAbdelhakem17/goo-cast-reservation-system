import useLocalization from "@/context/localization-provider/localization-context";

export default function useDateFormat() {
  const { lng } = useLocalization();

  return (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString(`${lng}-EG`, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
}
