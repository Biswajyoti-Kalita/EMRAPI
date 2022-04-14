const adminController = require("./admin/index");
const hospitalController = require("./hospital/index");
const pharmacyController = require("./pharmacy/index");

module.exports = function initializeApi(app) {
  const allControllers = [
    hospitalController,
    adminController,
    pharmacyController,
  ];
  allControllers.forEach((item) => item.initializeApi(app));
  return app;
};
