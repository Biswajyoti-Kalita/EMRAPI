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
      "/admin/adddisease",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.name === null || req.body.name === undefined)
            return res.send({
              status: "error",
              message: "Name is required ",
            });

          if (
            req.body.semantic_brand_name === null ||
            req.body.semantic_brand_name === undefined
          )
            return res.send({
              status: "error",
              message: " Semantic Brand Name is required ",
            });

          const result = await db.create(
            "disease",
            {
              name: req.body.name,
              semantic_brand_name: req.body.semantic_brand_name,
            },
            ["name", "semantic_brand_name"]
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
      "/admin/updatedisease",
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
            "disease",
            {
              name: req.body.name,
              semantic_brand_name: req.body.semantic_brand_name,
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
      "/admin/deletedisease",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.id == null)
            return res.send({
              status: "error",
              message: "Please send id",
            });

          const result = await db.destroy("disease", {
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
      "/admin/getdiseases",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {};

        if (req.body.name != null) where["name"] = req.body.name;

        if (req.body.id != null) where["id"] = +req.body.id;

        if (req.body.semantic_brand_name != null)
          where["semantic_brand_name"] = req.body.semantic_brand_name;

        try {
          const diseases = await db.findAll(
            "disease",
            ["id", "name", "semantic_brand_name"],
            where
          );
          res.send(diseases);
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
      "/admin/getdisease",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let where = {};

          if (req.body.id == null)
            return res.send({
              status: "error",
              message: "Please send id",
            });
          if (req.body.name != null) where["name"] = req.body.name;

          if (req.body.id != null) where["id"] = +req.body.id;

          if (req.body.semantic_brand_name != null)
            where["semantic_brand_name"] = req.body.semantic_brand_name;

          const disease = await db.findOne(
            "disease",
            ["id", "name", "semantic_brand_name"],
            where
          );
          res.send(disease);
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
