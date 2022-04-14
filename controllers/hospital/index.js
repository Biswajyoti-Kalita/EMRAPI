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
        "prescription.js",
        "profile.js",
        "patient.js",
        "doctor.js",
        "pharmacy.js",
        "pharmacist.js",
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
