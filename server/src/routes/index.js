const routes = [
  { path: "/api/v1/auth", router: require("./auth-route/auth-route") },
  { path: "/api/v1/studio", router: require("./studio-route/studio-route") },
  { path: "/api/v1/add-ons", router: require("./add-on-route/add-on-route") },
  {
    path: "/api/v1/hourly-packages",
    router: require("./hourly-package-route/hourly-package-route"),
  },
  {
    path: "/api/v1/bookings",
    router: require("./booking-route/booking-route"),
  },
  {
    path: "/api/v1/analytics",
    router: require("./analytics-route/analytics-route"),
  },
  {
    path: "/api/v1/price-rules",
    router: require("./price-rule-route/price-rule-route"),
  },
  {
    path: "/api/v1/price-exceptions",
    router: require("./price-exception-route/price-exception-route"),
  },
  {
    path: "/api/v1/categories",
    router: require("./category-route/category-route"),
  },
  { path: "/api/v1/user", router: require("./user-route/user-route") },
  { path: "/api/v1/admin", router: require("./admin-route/admin-route") },
  { path: "/api/v1/coupon", router: require("./coupon-route/coupon-route") },
  { path: "/api/v1/faq", router: require("./faq-route/faq-route") },
  {
    path: "/api/v1/subscribe",
    router: require("./newsletter-route/newsletter-route"),
  },
  {
    path: "/api/v1/user-profile",
    router: require("./user-profile-route/user-profile-route"),
  },
];

const amountRoutes = (app) => {
  routes.forEach(({ path, router }) => app.use(path, router));

  // Google reviews
  app.use(
    "/api/v1/reviews",
    require("../controller/review-controller/review-controller").getPlaceReviews
  );

  // Error handling and sending email
  app.use(
    "/api/v1/error-notification",
    require("./email-error").SendEmailRoute
  );
};

module.exports = amountRoutes;

module.exports = amountRoutes;
