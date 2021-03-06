const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
var controllers = [];

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      [
        "admin.js",
        "auth.js",
        "disease.js",
        "doctor.js",
        "drug_disease_ref.js",
        "drug.js",
        "patient.js",
        "pharmacist.js",
        "pharmacy.js",
        "hospital.js",
        "drug_disease_ref.js",
        "prescription.js",
      ].indexOf(file) >= 0
    );
  })
  .forEach((file) => {
    var controller = require(path.join(__dirname, file));
    controllers.push(controller);
  });
module.exports = {
  initializeApi: function (app) {
    controllers.forEach((item) => item.initializeApi(app));
  },
};
