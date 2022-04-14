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

    const role = 0;
    app.post(
      "/admin/addpharmacy",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (
            req.body.hospital_id === null ||
            req.body.hospital_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital id is required ",
            });

          if (req.body.name === null || req.body.name === undefined)
            return res.send({ status: "error", message: " Name is required " });

          if (
            req.body.hospital_pharmacy_id === null ||
            req.body.hospital_pharmacy_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital Pharmacy Id is required ",
            });

          const result = await db.create("pharmacy", {
            hospital_id: +req.body.hospital_id,
            name: req.body.name,
            street_address: req.body.street_address,
            city: req.body.city,
            zip: req.body.zip,
            state: req.body.state,
            hospital_pharmacy_id: +req.body.hospital_pharmacy_id,
          });
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
      "/admin/updatepharmacy",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.id == null) {
            return res.send({
              status: "error",
              message: "Id is required",
            });
          }

          const result = await db.update(
            "pharmacy",
            {
              name: req.body.name,
              street_address: req.body.street_address,
              city: req.body.city,
              zip: req.body.zip,
              state: req.body.state,
              hospital_pharmacy_id:
                req.body.hospital_pharmacy_id === null
                  ? null
                  : +req.body.hospital_pharmacy_id,
              hospital_id:
                req.body.hospital_id === null ? null : +req.body.hospital_id,
            },
            {
              id: +req.body.id,
            }
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
      "/admin/deletepharmacy",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.hospital_pharmacy_id == null)
            return res.send({
              status: "error",
              message: "Please send hospital_pharmacy_id",
            });

          let where = {
            id: +req.body.id,
          };

          if (req.body.id != null) where["id"] = req.body.id;

          const result = await db.destroy("pharmacy", where);
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
      "/admin/getpharmacies",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {};

        if (req.body.hospital_id != null)
          where["hospital_id"] = +req.body.hospital_id;

        if (req.body.name != null) where["name"] = req.body.name;

        if (req.body.street_address != null)
          where["street_address"] = req.body.street_address;

        if (req.body.city != null) where["city"] = req.body.city;

        if (req.body.zip != null) where["zip"] = req.body.zip;

        if (req.body.state != null) where["state"] = req.body.state;

        if (req.body.hospital_pharmacy_id != null)
          where["hospital_pharmacy_id"] = +req.body.hospital_pharmacy_id;

        try {
          const pharmacies = await db.findAll(
            "pharmacy",
            [
              "id",
              "hospital_id",
              "name",
              "street_address",
              "city",
              "zip",
              "state",
              "hospital_pharmacy_id",
            ],
            where
          );
          res.send(pharmacies);
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
      "/admin/getpharmacy",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let where = {};

          if (req.body.id == null)
            return res.send({
              status: "error",
              message: "Please send id",
            });

          if (req.body.id != null) where["id"] = +req.body.id;

          if (req.body.name != null) where["name"] = req.body.name;

          if (req.body.street_address != null)
            where["street_address"] = req.body.street_address;

          if (req.body.city != null) where["city"] = req.body.city;

          if (req.body.zip != null) where["zip"] = req.body.zip;

          if (req.body.state != null) where["state"] = req.body.state;

          if (req.body.hospital_pharmacy_id != null)
            where["hospital_pharmacy_id"] = +req.body.hospital_pharmacy_id;

          const pharmacy = await db.findOne(
            "pharmacy",
            [
              "id",
              "name",
              "street_address",
              "city",
              "zip",
              "state",
              "hospital_pharmacy_id",
              "hospital_id",
            ],
            where
          );
          res.send(pharmacy);
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
