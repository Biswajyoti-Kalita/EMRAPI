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
      "/pharmacy/getprescription",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.hospital_id === null || !req.body.hospital_id) {
            return res.send({
              status: "error",
              message: "Hospital id is required",
            });
          }

          if (
            req.body.hospital_prescription_id === null ||
            !req.body.hospital_prescription_id
          ) {
            return res.send({
              status: "error",
              message: "Hospital prescription id is required",
            });
          }
          console.log(
            "=> ",
            +req.body.hospital_id,
            +req.body.hospital_prescription_id
          );

          const prescription = await db
            .query(
              "SELECT hospital_prescription_id,prescription.hospital_patient_id,patient.first_name as patient_first_name,patient.middle_name as patient_middle_name,patient.last_name as patient_last_name,prescription.hospital_doctor_id,doctor.first_name as doctor_first_name, doctor.middle_name as doctor_middle_name,doctor.last_name as doctor_last_name, prescription.hospital_pharmacy_id,pharmacy.name as pharmacy_name from prescription,patient,doctor,pharmacy where prescription.hospital_id = patient.hospital_id and prescription.hospital_id = doctor.hospital_id and prescription.hospital_id = pharmacy.hospital_id and prescription.hospital_patient_id = patient.hospital_patient_id and prescription.hospital_doctor_id = doctor.hospital_doctor_id and prescription.hospital_pharmacy_id = pharmacy.hospital_pharmacy_id and prescription.hospital_id = $1 and prescription.hospital_prescription_id = $2;",
              [+req.body.hospital_id, +req.body.hospital_prescription_id]
            )
            .catch((err) => {
              console.log(err);
              return res.send({
                status: "error",
                message: "Something went wrong",
              });
            });

          if (prescription && prescription.rows[0]) {
            let drugs = await db.findAll(
              "prescription_drug",
              [
                "drug_code",
                "refills",
                "refills_balance",
                "frequency",
                "duration",
              ],
              {
                hospital_id: req.body.hospital_id,
                hospital_prescription_id: +req.body.hospital_prescription_id,
              }
            );
            prescription.rows[0]["drugs"] = drugs;
          }
          return res.send(
            prescription.rows
              ? prescription.rows[0]
                ? prescription.rows[0]
                : {}
              : {}
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
    app.post(
      "/pharmacy/reducerefill",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const { drug_code, hospital_id, hospital_prescription_id } = req.body;
          let reduce_count =
            req.body.reduce_count === null ||
            req.body.reduce_count === undefined
              ? 1
              : req.body.reduce_count;

          if (drug_code === null || drug_code === undefined) {
            return res.send({
              status: "error",
              message: " Drug code is required ",
            });
          }

          if (hospital_id === null || hospital_id === undefined) {
            return res.send({
              status: "error",
              message: "Hospital id is required ",
            });
          }
          if (
            hospital_prescription_id === null ||
            hospital_prescription_id === undefined
          ) {
            return res.send({
              status: "error",
              message: "Hospital prescription id is required ",
            });
          }

          const checkPrescriptionExist = await db.findOne(
            "prescription",
            ["id"],
            {
              hospital_id: +hospital_id,
              hospital_prescription_id: +hospital_prescription_id,
            }
          );

          if (!checkPrescriptionExist.id) {
            return res.send({
              status: "error",
              message: "Prescription does not exist",
            });
          }

          const checkDrugExist = await db.findOne(
            "prescription_drug",
            ["id", "refills_balance"],
            {
              hospital_id: +hospital_id,
              hospital_prescription_id: +hospital_prescription_id,
              drug_code: drug_code,
            }
          );

          if (!checkDrugExist.id) {
            return res.send({
              status: "error",
              message: "Drug does not exist on prescription",
            });
          }

          if (
            checkDrugExist.refills_balance === null ||
            checkDrugExist.refills_balance === 0
          )
            return res.send({
              status: "error",
              message: "Prescription refill balance is already nil",
            });

          if (reduce_count > +checkDrugExist.refills_balance) {
            return res.send({
              status: "error",
              message: "Reduce count exceds refill balance",
            });
          }
          const result = await db.update(
            "prescription_drug",
            {
              refills_balance:
                parseInt(checkDrugExist.refills_balance) - reduce_count,
            },
            {
              hospital_id: +hospital_id,
              hospital_prescription_id: +hospital_prescription_id,
              drug_code: drug_code,
            }
          );
          return res.send(result);
        } catch (error) {
          console.log(error);
          return res.send({
            status: "error",
            message: error,
          });
        }
      }
    );
  },
};
