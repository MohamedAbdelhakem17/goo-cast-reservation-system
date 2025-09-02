export default function useDateFormat() {
    return (date) => {
        if (!date) return ""; 

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return ""; 
        }

        return parsedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short", 
            day: "numeric",
        });
    };
}
