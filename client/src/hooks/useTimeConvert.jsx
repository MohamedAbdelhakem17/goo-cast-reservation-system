import useLocalization from "@/context/localization-provider/localization-context";

export default function useTimeConvert() {
  const { lng } = useLocalization();

  const toArabicDigits = (num) =>
    num.toString().replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

  return (time) => {
    const [hourStr, minute] = time?.split(":") || [];

    const hour = parseInt(hourStr, 10);
    if (isNaN(hour) || !minute) return "";

    const hour12 = hour % 12 || 12;

    if (lng === "ar") {
      const amPm = hour < 12 ? "صباحًا" : "مساءً";
      return `${toArabicDigits(hour12)}:${toArabicDigits(minute)} ${amPm}`;
    } else {
      const amPm = hour < 12 ? "AM" : "PM";
      return `${hour12}:${minute} ${amPm}`;
    }
  };
}
