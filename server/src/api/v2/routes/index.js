const routes = [
  {
    path: "api/v2/bookings",
    router: require("./booking-route/booking-route-v2"),
  },
];

const AmountRoutesV2 = (app) => {
  routes.forEach(({ path, router }) => app.use(path, router));
};

module.exports = AmountRoutesV2;
