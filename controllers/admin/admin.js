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
      "/admin/addadmin",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const admin_type = req.body.admin_type;
          let access_token = "";

          if (admin_type === null || admin_type === undefined)
            return res.send({
              status: "error",
              message: " Admin type is required ",
            });

          if (admin_type == 1) {
            if (
              req.body.hospital_id === null ||
              req.body.hospital_id === undefined
            )
              return res.send({
                status: "error",
                message: " Hospital id is required ",
              });
            const checkHospitalExist = await db.findOne("hospital", ["id"], {
              hospital_id: +req.body.hospital_id,
            });
            if (!checkHospitalExist) {
              return res.send({
                status: "error",
                message: "Hospital does not exist",
              });
            }

            access_token = jwt.sign(
              {
                hospital_id: +req.body.hospital_id,
                name: req.body.name,
                admin_type,
              },
              process.env.SECRET_KEY,
              {}
            );
            const result = await db.create(
              "admin",
              {
                name: "",
                email: "",
                password: "",
                access_token: access_token,
                admin_type: 1,
                hospital_id: +req.body.hospital_id,
              },
              ["hospital_id"]
            );
            return res.send(result);
          } else if (admin_type == 2) {
            if (req.body.name === null || req.body.name === undefined)
              return res.send({
                status: "error",
                message: " Name is required ",
              });

            access_token = jwt.sign(
              {
                name: req.body.name,
                admin_type,
              },
              process.env.SECRET_KEY,
              {}
            );
            const result = await db.create(
              "admin",
              {
                name: req.body.name,
                email: "",
                password: "",
                access_token: access_token,
                admin_type: 2,
                hospital_id: null,
              },
              ["hospital_id"]
            );
            return res.send(result);
          } else {
            if (req.body.name === null || req.body.name === undefined)
              return res.send({
                status: "error",
                message: " Name is required ",
              });

            if (req.body.email === null || req.body.email === undefined)
              return res.send({
                status: "error",
                message: " Email is required ",
              });

            // if (req.body.password === null || req.body.password === undefined)
            //   return res.send({
            //     status: "error",
            //     message: " Password is required ",
            //   });

            const result = await db.create(
              "admin",
              {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                access_token: "",
                admin_type: 0,
                hospital_id: null,
              },
              ["email"]
            );
            return res.send(result);
          }
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/admin/updateadmin",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const admin_type = req.body.admin_type;
          let access_token = "";

          if (req.body.id == null) {
            return res.send({
              status: "error",
              message: "Id is required",
            });
          }
          if (admin_type == null || admin_type == undefined) {
            return res.send({
              status: "error",
              message: "Admin type is required",
            });
          }

          const prevData = await db.findOne(
            "admin",
            ["id", "name", "admin_type", "email", "password", "access_token"],
            {
              id: +req.body.id,
            }
          );

          if (admin_type == 1) {
            if (req.body.hospital_id != null) {
              const checkHospitalExist = await db.findOne("hospital", ["id"], {
                hospital_id: +req.body.hospital_id,
              });
              if (!checkHospitalExist) {
                return res.send({
                  status: "error",
                  message: "Hospital does not exist",
                });
              }
              if (prevData.hospital_id != req.body.hospital_id) {
                let access_token = jwt.sign(
                  {
                    hospital_id: +req.body.hospital_id,
                    name: req.body.name,
                    admin_type,
                  },
                  process.env.SECRET_KEY,
                  {}
                );
                const result = await db.update(
                  "admin",
                  {
                    name: req.body.name,
                    email: "",
                    password: "",
                    access_token: access_token,
                  },
                  {
                    id: +req.body.id,
                  }
                );
                return res.send(result);
              } else {
                return res.send({
                  status: "error",
                  message: "Nothing to update",
                });
              }
            } else {
              return res.send({
                status: "error",
                message: "Nothing to update",
              });
            }
          } else if (admin_type == 2) {
            const result = await db.update(
              "admin",
              {
                name: req.body.name,
              },
              {
                id: +req.body.id,
              }
            );
            return res.send(result);
          } else {
            if (req.body.email != null) {
              const checkEmailExist = await db.findOne("admin", ["id"], {
                email: req.body.email,
              });
              console.log("checkEmailExist", checkEmailExist);
              console.log("prevData ", prevData);
              if (
                checkEmailExist &&
                checkEmailExist.id &&
                checkEmailExist.id != prevData.id
              ) {
                return res.send({
                  status: "error",
                  message: "Email already exist with another account",
                });
              }
            }

            const result = await db.update(
              "admin",
              {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                access_token: "",
                hospital_id: null,
              },
              {
                id: +req.body.id,
              }
            );
            return res.send(result);
          }
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/admin/deleteadmin",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.id == null)
            return res.send({
              status: "error",
              message: "Please send id",
            });

          const result = await db.destroy("admin", {
            id: req.body.id,
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
      "/admin/getadmins",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {};

        if (req.body.name != null) where["name"] = req.body.name;
        if (req.body.hospital_id != null)
          where["hospital_id"] = +req.body.hospital_id;

        if (req.body.email != null) where["email"] = req.body.email;
        if (req.body.admin_type != null)
          where["admin_type"] = +req.body.admin_type;

        try {
          const admins = await db.findAll(
            "admin",
            [
              "id",
              "name",
              "email",
              "admin_type",
              "access_token",
              "hospital_id",
            ],
            where
          );
          res.send(admins);
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
      "/admin/getadmin",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {};

        if (req.body.id == null || req.body.id == undefined)
          return res.send({ status: "error", message: "Please send id" });

        where["id"] = req.body.id;

        try {
          const admins = await db.findOne(
            "admin",
            ["id", "name", "email", "admin_type", "access_token"],
            where
          );
          res.send(admins);
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
