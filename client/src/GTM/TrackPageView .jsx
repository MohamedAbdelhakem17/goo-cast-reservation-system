import { useEffect } from "react";
import TagManager from "react-gtm-module";
import { useLocation } from "react-router-dom";

export default function TrackPageView() {
  const location = useLocation();

  useEffect(() => {
    const tagManagerArgs = {
      dataLayer: {
        event: "pageview",
        page: location.pathname,
      },
    };
    TagManager.dataLayer(tagManagerArgs);
  }, [location]);

  return null;
}
