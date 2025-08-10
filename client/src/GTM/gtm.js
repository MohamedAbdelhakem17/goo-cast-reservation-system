export function trackPageView(path) {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: "pageview",
      page: path,
    });
  }
}

export function trackEvent(eventName, params) {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
}
