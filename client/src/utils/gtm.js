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

export function trackBookingStep(step, params) {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: "bookingStep",
      step: step,
      ...params,
    });
  }
}

export function tracking(event, params) {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: event,
      ...params,
    });
  }
}
