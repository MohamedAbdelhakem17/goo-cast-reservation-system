(function (win, doc) {
  var containerId = "GTM-P92D4BCV";
  var dataLayerName = "dataLayer";
  var gtmScript = doc.createElement("script");
  var gtmScriptUrl = new URL("https://www.googletagmanager.com/gtm.js");

  if (typeof containerId !== "string" || typeof dataLayerName !== "string") {
    return;
  }

  if (!Array.isArray(win[dataLayerName])) {
    win[dataLayerName] = [];
  }
  // Add 2 new items to data layer
  win[dataLayerName].push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });

  gtmScriptUrl.searchParams.append("id", containerId);
  if (dataLayerName !== "dataLayer") {
    gtmScriptUrl.searchParams.append("l", dataLayerName);
  }
  gtmScript.async = true;
  gtmScript.src = gtmScriptUrl.toString();
  doc.head.appendChild(gtmScript);
})(window, document);
