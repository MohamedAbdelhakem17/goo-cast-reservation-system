const routes = [

];

const AmountRoutesV2 = (app) => {
  routes.forEach(({ path, router }) => app.use(path, router));


};

module.exports = AmountRoutesV2;

