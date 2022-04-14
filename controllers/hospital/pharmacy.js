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
const axiosService = require("../../services/axiosService");

module.exports = {
  initializeApi: function (app) {
    const basic_attributes = ["createdAt", "updatedAt"];

    const role = 1;
    app.post(
      "/hospital/addpharmacy",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
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
      "/hospital/updatepharmacy",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.hospital_pharmacy_id == null) {
            return res.send({
              status: "error",
              message: "Hospital pharmacy id is required",
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
            },
            {
              hospital_pharmacy_id: +req.body.hospital_pharmacy_id,
              hospital_id: +req.body.hospital_id,
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
      "/hospital/deletepharmacy",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let where = {
            hospital_id: +req.body.hospital_id,
          };
          if (req.body.hospital_pharmacy_id == null)
            return res.send({
              status: "error",
              message: "Please send hospital_pharmacy_id",
            });

          if (req.body.hospital_pharmacy_id != null)
            where["hospital_pharmacy_id"] = req.body.hospital_pharmacy_id;

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
      "/hospital/getpharmacies",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {
          hospital_id: +req.body.hospital_id,
        };

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
      "/hospital/getpharmacy",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let where = {
            hospital_id: +req.body.hospital_id,
          };

          if (req.body.hospital_pharmacy_id == null)
            return res.send({
              status: "error",
              message: "Please send hospital_pharmacy_id",
            });
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
              "name",
              "street_address",
              "city",
              "zip",
              "state",
              "hospital_pharmacy_id",
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

    app.post(
      "/hospital/inventory/:offset",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let offset = req.params.offset;
          const data = req.body;

          let pharmacy_url = process.env.PHARMACY_URL;
          let headers = {
            "content-type": "application/json",
          };
          const result = await axiosService.postRequest(
            pharmacy_url + "/emr/inventory/" + offset,
            data,
            headers
          );
          console.log(result);
          return res.send(result ? result.data : {});
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
      "/hospital/getcategories",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let offset = req.params.offset;
          const data = req.body;

          let pharmacy_url = process.env.PHARMACY_URL;
          let headers = {
            "content-type": "application/json",
          };
          const result = await axiosService.postRequest(
            pharmacy_url + "/emr/getcategories",
            data,
            headers
          );
          console.log(result);
          return res.send(result ? result.data : {});
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
      "/hospital/addorder",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const data = req.body;

          const profile = await db.findOne("hospital", ["id", "name"], {
            id: +req.body.hospital_id,
          });

          console.log(profile);
          if (profile) {
            data["hospital_name"] = profile.name;
          }

          let pharmacy_url = process.env.PHARMACY_URL;
          let headers = {
            "content-type": "application/json",
          };
          const result = await axiosService.postRequest(
            pharmacy_url + "/emr/addorder",
            data,
            headers
          );
          console.log(result);
          return res.send(result ? result.data : {});
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
      "/hospital/addinventoryadmin",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const data = req.body;

          let pharmacy_url = process.env.PHARMACY_URL;
          let headers = {
            "content-type": "application/json",
          };
          const result = await axiosService.postRequest(
            pharmacy_url + "/emr/adduser",
            data,
            headers
          );
          console.log(result);
          return res.send(result ? result.data : {});
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
      "/hospital/updateinventoryadmin",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const data = req.body;

          let pharmacy_url = process.env.PHARMACY_URL;
          let headers = {
            "content-type": "application/json",
          };
          const result = await axiosService.postRequest(
            pharmacy_url + "/emr/updateuser",
            data,
            headers
          );
          console.log(result);
          return res.send(result ? result.data : {});
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
      "/hospital/removeinventoryadmin",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const data = req.body;

          let pharmacy_url = process.env.PHARMACY_URL;
          let headers = {
            "content-type": "application/json",
          };
          const result = await axiosService.postRequest(
            pharmacy_url + "/emr/removeuser",
            data,
            headers
          );
          console.log(result);
          return res.send(result ? result.data : {});
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
      "/hospital/fulfillorderitem",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const data = req.body;

          let pharmacy_url = process.env.PHARMACY_URL;
          let headers = {
            "content-type": "application/json",
          };
          const result = await axiosService.postRequest(
            pharmacy_url + "/emr/fulfillorderitem",
            data,
            headers
          );
          console.log(result);
          return res.send(result ? result.data : {});
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
      "/hospital/cancelorder",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const data = req.body;

          let pharmacy_url = process.env.PHARMACY_URL;
          let headers = {
            "content-type": "application/json",
          };
          const result = await axiosService.postRequest(
            pharmacy_url + "/emr/cancelorder",
            data,
            headers
          );
          console.log(result);
          return res.send(result ? result.data : {});
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
      "/hospital/orders/:offset",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let offset = req.params.offset;
          const data = req.body;

          let pharmacy_url = process.env.PHARMACY_URL;
          let headers = {
            "content-type": "application/json",
          };
          const result = await axiosService.postRequest(
            pharmacy_url + "/emr/orders/" + offset,
            data,
            headers
          );
          console.log(result);
          return res.send(result ? result.data : {});
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
      "/hospital/order",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const data = req.body;

          let pharmacy_url = process.env.PHARMACY_URL;
          let headers = {
            "content-type": "application/json",
          };
          const result = await axiosService.postRequest(
            pharmacy_url + "/emr/order",
            data,
            headers
          );
          console.log(result);
          return res.send(result ? result.data : {});
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
