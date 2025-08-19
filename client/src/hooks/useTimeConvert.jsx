export default function useTimeConvert() {
    return (time) => {
        const [hourStr, minute] = time?.split(":") || [];

        const hour = parseInt(hourStr, 10);

        if (isNaN(hour) || !minute) {
            return "";
        }

        const hour12 = hour % 12 || 12;
        const amPm = hour < 12 ? "AM" : "PM";

        return `${hour12}:${minute} ${amPm}`;
    };
}
