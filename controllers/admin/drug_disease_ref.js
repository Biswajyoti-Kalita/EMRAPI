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
      "/admin/adddrug_disease_ref",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const { drug_code, disease_id } = req.body;

          const checkDrugCodeExist = await db.findOne("drug", ["id"], {
            drug_code,
          });

          if (!checkDrugCodeExist) {
            return res.send({
              status: "error",
              message: "Drug Code does not exist",
            });
          }

          const checkDiseaseExist = await db.findOne("disease", ["id"], {
            id: disease_id,
          });

          if (!checkDiseaseExist) {
            return res.send({
              status: "error",
              message: "Disease does not exist",
            });
          }

          const result = await db.create(
            "drug_disease_ref",
            {
              drug_code,
              disease_id,
            },
            ["drug_code", "disease_id"]
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
      "/admin/updatedrug_disease_ref",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.id === null || req.body.id === undefined) {
            return res.send({
              status: "error",
              message: "Id is required",
            });
          }
          const { drug_code, disease_id } = req.body;
          const checkDrugCodeExist = await db.findOne("drug", ["id"], {
            drug_code,
          });

          if (!checkDrugCodeExist) {
            return res.send({
              status: "error",
              message: "Drug Code does not exist",
            });
          }

          const checkDiseaseExist = await db.findOne("disease", ["id"], {
            id: disease_id,
          });

          if (!checkDiseaseExist) {
            return res.send({
              status: "error",
              message: "Disease does not exist",
            });
          }

          const result = await db.update(
            "drug_disease_ref",
            {
              drug_code,
              disease_id,
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
      "/admin/deletedrug_disease_ref",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.id == null)
            return res.send({
              status: "error",
              message: "Please send id",
            });

          const result = await db.destroy("drug_disease_ref", {
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
      "/admin/getdrug_disease_refs",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let where = {};
          const { drug_code, disease_id, id } = req.body;

          if (drug_code != null) {
            where["drug_code"] = drug_code;
          }
          if (disease_id != null) {
            where["disease_id"] = +disease_id;
          }
          if (id != null) {
            where["id"] = +id;
          }

          const drug_disease_refs = await db.findAll(
            "drug_disease_ref",
            ["id", "drug_code", "disease_id"],
            where,
            [
              {
                table: "drug",
                attributes: ["drug_name", "semantic_brand_name"],
                join_as: "drug.drug_code = drug_disease_ref.drug_code",
              },
              {
                table: "disease",
                attributes: ["name"],
                join_as: "disease.id = drug_disease_ref.disease_id",
              },
            ]
          );
          res.send(drug_disease_refs);
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
      "/admin/getdrug_disease_ref",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let where = {};
          const { drug_code, disease_id, id } = req.body;

          if (id == null)
            return res.send({
              status: "error",
              message: "Please send id",
            });

          if (drug_code != null) {
            where["drug_code"] = drug_code;
          }
          if (disease_id != null) {
            where["disease_id"] = disease_id;
          }
          if (id != null) {
            where["id"] = id;
          }

          const drug_disease_ref = await db.findOne(
            "drug_disease_ref",
            ["id", "drug_code", "disease_id"],
            where,
            [
              {
                table: "drug",
                attributes: ["drug_name", "semantic_brand_name"],
                join_as: "drug.drug_code = drug_disease_ref.drug_code",
              },
              {
                table: "disease",
                attributes: ["name"],
                join_as: "disease.id = drug_disease_ref.disease_id",
              },
            ]
          );
          res.send(drug_disease_ref);
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
