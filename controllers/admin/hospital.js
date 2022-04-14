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
      "/admin/addhospital",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.name === null || req.body.name === undefined)
            return res.send({ status: "error", message: " Name is required " });

          const result = await db.create(
            "hospital",
            {
              name: req.body.name,
              street_address: req.body.street_address,
              city: req.body.city,
              zip: req.body.zip,
              state: req.body.state,
            },
            []
          );
          console.log(result);
          if (result && result.res && result.res.rows && result.res.rows[0]) {
            let currentHospital = result.res.rows[0];
            if (currentHospital && currentHospital.id) {
              let access_token = jwt.sign(
                {
                  hospital_id: currentHospital.id,
                  name: req.body.name,
                  admin_type: 1,
                },
                process.env.SECRET_KEY,
                {}
              );
              const result2 = await db.create("admin", {
                admin_type: 1,
                hospital_id: currentHospital.id,
                access_token,
              });
              console.log(result2);
            }
          }
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
      "/admin/updatehospital",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.id === null || req.body.id === undefined) {
            return res.send({
              status: "error",
              message: "Id is required",
            });
          }

          const result = await db.update(
            "hospital",
            {
              name: req.body.name,
              street_address: req.body.street_address,
              city: req.body.city,
              zip: req.body.zip,
              state: req.body.state,
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
      "/admin/deletehospital",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.id == null)
            return res.send({
              status: "error",
              message: "Please send id",
            });

          const checkExist = await db.findOne(
            "admin",
            ["id", "hospital_id", "admin_type"],
            {
              hospital_id: +req.body.id,
            }
          );

          console.log(checkExist);
          if (checkExist && checkExist.admin_type == 1) {
            await db.destroy("admin", {
              id: checkExist.id,
            });
          }
          const result = await db.destroy("hospital", {
            id: +req.body.id,
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
      "/admin/gethospitals",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {};

        if (req.body.name != null) where["name"] = req.body.name;

        if (req.body.street_address != null)
          where["street_address"] = req.body.street_address;

        if (req.body.city != null) where["city"] = req.body.city;

        if (req.body.zip != null) where["zip"] = req.body.zip;

        if (req.body.state != null) where["state"] = req.body.state;

        try {
          let hospitals = await db.findAll(
            "hospital",
            ["id", "name", "street_address", "city", "zip", "state"],
            where
          );

          let accessTokens = await db.findAll(
            "admin",
            ["access_token", "hospital_id", "id"],
            {
              admin_type: 1,
            }
          );
          let mappedTokens = {};
          accessTokens?.map((item) => {
            if (item.hospital_id) {
              mappedTokens[item.hospital_id] = item.access_token;
            }
          });

          hospitals = hospitals.map((item) => {
            if (item.id && mappedTokens[item.id]) {
              item["access_token"] = mappedTokens[item.id];
            }
            return item;
          });
          console.log("accessTokens ", accessTokens);

          res.send(hospitals);
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
      "/admin/gethospital",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.id == null)
            return res.send({
              status: "error",
              message: "Please send id",
            });
          let where = {
            id: +req.body.id,
          };

          const hospital = await db.findOne(
            "hospital",
            ["id", "name", "street_address", "city", "zip", "state"],
            where
          );
          res.send(hospital);
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
