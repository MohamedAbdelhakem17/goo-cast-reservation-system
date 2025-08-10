import { useEffect } from "react";
import TagManager from "react-gtm-module";
import { useLocation } from "react-router-dom";

export default function TrackPageView() {
  const location = useLocation();

useEffect(() => {
  TagManager.dataLayer({
    dataLayer: {
      event: "page_view",
      page_path: location.pathname,
    },
  });
}, [location.pathname]);


  return null;
}
