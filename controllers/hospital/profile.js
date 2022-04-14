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
      "/hospital/updateprofile",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const { name, city, street_address, zip, state } = req.body;
          let queryString = "";
          let where = [];
          if (name === null || name === "") {
            return res.send({
              status: "error",
              message: "Name is required",
            });
          }

          if (req.body.name != null) {
            where.push(req.body.name);
            queryString += " name=$" + where.length;
          }

          if (req.body.city != null) {
            where.push(req.body.city);
            queryString += ",city=$" + where.length;
          }

          if (req.body.street_address != null) {
            where.push(req.body.street_address);
            queryString += ",street_address=$" + where.length;
          }

          if (req.body.zip != null) {
            where.push(req.body.zip);
            queryString += ",zip=$" + where.length;
          }

          if (req.body.state != null) {
            where.push(req.body.state);
            queryString += ",state=$" + where.length;
          }

          where.push(+req.body.hospital_id);
          queryString += " where id = $" + where.length;

          const profile = await db
            .query("update hospital set " + queryString, where)
            .catch((err) => {
              console.log(err);
              return res.send({
                status: "error",
                message: "Something went wrong",
              });
            });

          return res.send({
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
      "/hospital/getprofile",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          console.log("hospital id ", req.body.hospital_id);
          const profile = await db
            .query(
              "SELECT name,street_address,city,state,zip from  hospital where id = $1",
              [+req.body.hospital_id]
            )
            .catch((err) => {
              console.log(err);
              return res.send({
                status: "error",
                message: "Something went wrong",
              });
            });
          return res.send(
            profile.rows ? (profile.rows[0] ? profile.rows[0] : {}) : {}
          );
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
