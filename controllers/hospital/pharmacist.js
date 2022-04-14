"use strict";
var express = require("express");
var router = express.Router();
var passport = require("passport");
var app = express();
app.use(passport.initialize());
app.use(passport.session());
var randomstring = require("randomstring");
var jwt = require("jsonwebtoken");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var db = require("./../../models");
var file_upload = require("./../../services/upload");
var roleService = require("./../../services/roleService");
var passwordService = require("./../../services/passwordService");

module.exports = {
  initializeApi: function (app) {
    const basic_attributes = ["createdAt", "updatedAt"];

    const role = 1;
    app.post(
      "/hospital/addpharmacist",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (
            req.body.hospital_pharmacist_id === null ||
            req.body.hospital_pharmacist_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital Pharmacist Id is required ",
            });

          if (
            req.body.hospital_pharmacy_id === null ||
            req.body.hospital_pharmacy_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital Pharmacy Id is required ",
            });

          const checkPharmacyExist = await db.findOne("pharmacy"["id"], {
            hospital_id: +req.body.hospital_id,
            hospital_pharmacy_id: +req.body.hospital_pharmacy_id,
          });
          if (!checkPharmacyExist) {
            return res.send({
              status: "error",
              message: "Pharmacy does not exist",
            });
          }

          const result = await db.create(
            "pharmacist",
            {
              hospital_id: +req.body.hospital_id,
              pharmacy_id: checkPharmacyExist.id,
              hospital_pharmacist_id: +req.body.hospital_pharmacist_id,
              hospital_pharmacy_id: +req.body.hospital_pharmacy_id,
              name: req.body.name,
            },
            ["hospital_id", "hospital_pharmacist_id"]
          );
          res.send(result);
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/hospital/updatepharmacist",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let checkPharmacyExist = null;
          if (
            req.body.hospital_pharmacist_id === null ||
            req.body.hospital_pharmacist_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital Pharmacist Id is required ",
            });

          let obj = {
            hospital_pharmacy_id: +req.body.hospital_pharmacy_id,
            name: req.body.name,
          };

          if (req.body.hospital_pharmacy_id != null) {
            checkPharmacyExist = await db.findOne("pharmacy"["id"], {
              hospital_id: +req.body.hospital_id,
              hospital_pharmacy_id: +req.body.hospital_pharmacy_id,
            });
            if (!checkPharmacyExist) {
              return res.send({
                status: "error",
                message: "Pharmacy does not exist",
              });
            }
            obj["pharmacy_id"] = checkPharmacyExist.id;
          }
          await db.update("pharmacist", obj, {
            hospital_pharmacist_id: +req.body.hospital_pharmacist_id,
            hospital_id: +req.body.hospital_id,
          });
          res.send({
            status: "success",
            message: "done",
          });
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/hospital/deletepharmacist",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let where = {
            hospital_id: +req.body.hospital_id,
          };

          if (req.body.hospital_pharmacist_id == null)
            return res.send({
              status: "error",
              message: "Please send hospital_pharmacist_id",
            });

          if (req.body.hospital_pharmacist_id != null)
            where["hospital_pharmacist_id"] = +req.body.hospital_pharmacist_id;

          const result = await db.destroy("pharmacist", where);
          res.send(result);
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/hospital/getpharmacists",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {
          hospital_id: +req.body.hospital_id,
        };

        if (req.body.hospital_pharmacist_id != null)
          where["hospital_pharmacist_id"] = req.body.hospital_pharmacist_id;

        if (req.body.name != null)
          where["name"] = req.body.hospital_pharmacist_id;

        if (req.body.hospital_pharmacy_id != null)
          where["hospital_pharmacy_id"] = req.body.hospital_pharmacy_id;

        try {
          const pharmacists = await db.findAll(
            "pharmacist",
            ["hospital_pharmacist_id", "hospital_pharmacy_id", "name"],
            where
          );
          res.send(pharmacists);
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
    );

    app.post(
      "/hospital/getpharmacist",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let where = {
            hospital_id: +req.body.hospital_id,
          };
          if (req.body.hospital_pharmacist_id === null) {
            return res.send({
              status: "error",
              message: "Please send hospital_pharmacist_id",
            });
          }

          if (req.body.hospital_pharmacist_id != null)
            where["hospital_pharmacist_id"] = req.body.hospital_pharmacist_id;

          const pharmacist = await db.findOne(
            "pharmacist",
            ["hospital_pharmacist_id", "hospital_pharmacy_id", "name"],
            where
          );
          res.send(pharmacist);
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
    );
  },
};
