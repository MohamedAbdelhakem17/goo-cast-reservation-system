import { useCallback } from "react";
import TagManager from "react-gtm-module";

export default function GTMEventTracking() {
  const sendEvent = useCallback((eventName, data = {}) => {
    const tagManagerArgs = {
      dataLayer: {
        event: eventName,
        ...data,
      },
    };
    TagManager.dataLayer(tagManagerArgs);
  }, []);

  return sendEvent;
}
