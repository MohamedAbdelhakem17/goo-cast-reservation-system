export function trackPageView(path, params) {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: "pageview",
      page: path,
      ...params,
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

export function trackBookingStep(step, params) {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: "bookingStep",
      step: step,
      ...params,
    });
  }
}
