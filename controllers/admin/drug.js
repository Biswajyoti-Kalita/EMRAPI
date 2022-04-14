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
      "/admin/adddrug",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.drug_code === null || req.body.drug_code === undefined)
            return res.send({
              status: "error",
              message: " Drug Code is required ",
            });

          if (req.body.drug_name === null || req.body.drug_name === undefined)
            return res.send({
              status: "error",
              message: " drug Name is required ",
            });

          if (
            req.body.semantic_brand_name === null ||
            req.body.semantic_brand_name === undefined
          )
            return res.send({
              status: "error",
              message: " Semantic Brand Name is required ",
            });

          const result = await db.create("drug", {
            drug_code: req.body.drug_code,
            drug_name: req.body.drug_name,
            semantic_brand_name: req.body.semantic_brand_name,
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
      "/admin/updatedrug",
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
            "drug",
            {
              drug_code: req.body.drug_code,
              drug_name: req.body.drug_name,
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
      "/admin/deletedrug",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.id == null)
            return res.send({
              status: "error",
              message: "Please send id",
            });

          const result = await db.destroy("drug", {
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
      "/admin/getdrugs",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {};

        if (req.body.id != null) where["id"] = +req.body.id;

        if (req.body.drug_code != null) where["drug_code"] = req.body.drug_code;

        if (req.body.drug_name != null) where["drug_name"] = req.body.drug_name;

        if (req.body.semantic_brand_name != null)
          where["semantic_brand_name"] = req.body.semantic_brand_name;

        try {
          const drugs = await db.findAll(
            "drug",
            ["id", "drug_code", "drug_name", "semantic_brand_name"],
            where
          );
          res.send(drugs);
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
      "/admin/getdrug",
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

          const drug = await db.findOne(
            "drug",
            ["id", "drug_code", "drug_name", "semantic_brand_name"],
            where
          );
          res.send(drug);
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
