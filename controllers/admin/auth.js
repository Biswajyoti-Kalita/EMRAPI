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

    app.post("/admin/login", async function (req, res) {
      try {
        const { email, password } = req.body;
        const admin = await db.findOne("admin", ["name", "admin_type", "id"], {
          email: email,
          password: password,
        });
        console.log("admin ", admin);
        if (!admin.id) {
          return res.send({
            status: "error",
            message: "Email or password invalid",
          });
        }
        var token = jwt.sign(admin, process.env.SECRET_KEY, {});
        res.send({
          status: "success",
          token: token,
        });
      } catch (error) {
        console.log(error);
        res.send({
          status: "error",
          message: error,
        });
      }
    });
  },
};
