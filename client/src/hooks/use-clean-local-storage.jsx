import { useLocation } from "react-router-dom";

export default function useCleanLocalStorage() {
  const location = useLocation();

  const cleanLocalStorage = () => {
    if (
      location.pathname !== "/booking" &&
      location.pathname !== "/booking/confirmation" &&
      !location.search.startsWith("?step=")
    ) {
      localStorage.removeItem("bookingData");
      localStorage.removeItem("bookingStep");
    }
  };

  return cleanLocalStorage;
}
