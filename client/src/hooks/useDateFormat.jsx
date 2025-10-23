import useLocalization from "@/context/localization-provider/localization-context";

export default function useDateFormat() {
  let lng = "en";
  try {
    const localization = useLocalization();
    if (localization && localization.lng) {
      lng = localization.lng;
    }
  } catch (err) {
    lng = "en";
  }

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
