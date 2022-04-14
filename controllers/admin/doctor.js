"use strict";
var express = require("express");
var router = express.Router();
var passport = require("passport");
var app = express();
app.use(passport.initialize());
app.use(passport.session());
var randomstring = require("randomstring");
var jwt = require("jsonwebtoken");

var db = require("./../../models");
var file_upload = require("./../../services/upload");
var roleService = require("./../../services/roleService");
var passwordService = require("./../../services/passwordService");

module.exports = {
  initializeApi: function (app) {
    const basic_attributes = ["createdAt", "updatedAt"];

    const role = 0;
    app.post(
      "/admin/adddoctor",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (
            req.body.hospital_id === null ||
            req.body.hospital_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital Id is required ",
            });

          if (
            req.body.hospital_doctor_id === null ||
            req.body.hospital_doctor_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital Doctor Id is required ",
            });

          if (req.body.first_name === null || req.body.first_name === undefined)
            return res.send({
              status: "error",
              message: " First Name is required ",
            });

          const data = await db.create(
            "doctor",
            {
              hospital_id: +req.body.hospital_id,
              hospital_doctor_id: +req.body.hospital_doctor_id,
              first_name: req.body.first_name,
              middle_name: req.body.middle_name,
              last_name: req.body.last_name,
              gender: req.body.gender,
              photo: req.body.photo,
              signature: req.body.signature,
              street_address: req.body.street_address,
              city: req.body.city,
              zip: req.body.zip,
              state: req.body.state,
            },
            ["hospital_id", "hospital_doctor_id"]
          );
          res.send(data);
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/admin/updatedoctor",
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
            "doctor",
            {
              first_name: req.body.first_name,
              middle_name: req.body.middle_name,
              last_name: req.body.last_name,
              gender: req.body.gender,
              photo: req.body.photo,
              signature: req.body.signature,
              street_address: req.body.street_address,
              city: req.body.city,
              zip: req.body.zip,
              state: req.body.state,
              hospital_id: +req.body.hospital_id,
              hospital_doctor_id: req.body.hospital_doctor_id,
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
      "/admin/deletedoctor",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.id == null) {
            return res.send({
              status: "error",
              message: "Id is required",
            });
          }

          let where = {};

          if (req.body.id != null) where["id"] = +req.body.id;

          const result = await db.destroy("doctor", where);
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
      "/admin/getdoctors",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {};

        if (req.body.id != null) where["id"] = +req.body.id;

        if (req.body.hospital_id != null)
          where["hospital_id"] = +req.body.hospital_id;

        if (req.body.hospital_doctor_id != null)
          where["hospital_doctor_id"] = +req.body.hospital_doctor_id;

        if (req.body.first_name != null)
          where["first_name"] = req.body.first_name;

        if (req.body.middle_name != null)
          where["middle_name"] = req.body.middle_name;

        if (req.body.last_name != null) where["last_name"] = req.body.last_name;

        if (req.body.gender != null) where["gender"] = req.body.gender;

        if (req.body.photo != null) where["photo"] = req.body.photo;

        if (req.body.signature != null) where["signature"] = req.body.signature;

        if (req.body.street_address != null)
          where["street_address"] = req.body.street_address;

        if (req.body.city != null) where["city"] = req.body.city;

        if (req.body.zip != null) where["zip"] = req.body.zip;

        if (req.body.state != null) where["state"] = req.body.state;

        try {
          const doctors = await db.findAll(
            "doctor",
            [
              "id",
              "hospital_doctor_id",
              "first_name",
              "middle_name",
              "last_name",
              "gender",
              "city",
              "street_address",
              "zip",
              "state",
            ],
            where
          );
          res.send(doctors);
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
      "/admin/getdoctor",
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

          if (req.body.hospital_id != null)
            where["hospital_id"] = +req.body.hospital_id;

          if (req.body.hospital_doctor_id != null)
            where["hospital_doctor_id"] = +req.body.hospital_doctor_id;

          if (req.body.first_name != null)
            where["first_name"] = req.body.first_name;

          if (req.body.middle_name != null)
            where["middle_name"] = req.body.middle_name;

          if (req.body.last_name != null)
            where["last_name"] = req.body.last_name;

          if (req.body.gender != null) where["gender"] = req.body.gender;

          if (req.body.photo != null) where["photo"] = req.body.photo;

          if (req.body.signature != null)
            where["signature"] = req.body.signature;

          if (req.body.street_address != null)
            where["street_address"] = req.body.street_address;

          if (req.body.city != null) where["city"] = req.body.city;

          if (req.body.zip != null) where["zip"] = req.body.zip;

          if (req.body.state != null) where["state"] = req.body.state;

          const doctor = await db.findOne(
            "doctor",
            [
              "id",
              "hospital_doctor_id",
              "first_name",
              "middle_name",
              "last_name",
              "gender",
              "street_address",
              "city",
              "zip",
              "state",
            ],
            where
          );
          res.send(doctor);
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
