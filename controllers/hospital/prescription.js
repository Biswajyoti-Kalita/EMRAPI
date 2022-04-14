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

    const role = 1;
    app.post(
      "/hospital/addprescription",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let patient_id, pharmacy_id, doctor_id;
          console.log(req.body);
          const drugs = req.body.drugs;
          console.log("\n\n\n", typeof drugs, drugs[0]);

          if (!drugs || !drugs[0]) {
            return res.send({
              status: "error",
              message: " Drugs is required ",
            });
          }

          if (typeof drugs != "object") {
            return res.send({
              status: "error",
              message: " Drugs should be array of object ",
            });
          }
          for (let i = 0; i < drugs.length; i++) {
            if (!drugs[i].drug_code) {
              return res.send({
                status: "error",
                message: " Drug code is required for index " + i,
              });
            }
          }

          if (
            req.body.hospital_patient_id === null ||
            req.body.hospital_patient_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital Patient Id is required ",
            });

          if (
            req.body.hospital_doctor_id === null ||
            req.body.hospital_doctor_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital Doctor Id is required ",
            });

          if (
            req.body.hospital_prescription_id === null ||
            req.body.hospital_prescription_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital Prescription Id is required ",
            });

          if (
            req.body.hospital_pharmacy_id === null ||
            req.body.hospital_pharmacy_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital Pharmacy Id is required ",
            });

          const checkPrescriptionExist = await db.findOne(
            "prescription",
            ["id"],
            {
              hospital_prescription_id: +req.body.hospital_prescription_id,
              hospital_id: +req.body.hospital_id,
            }
          );

          if (checkPrescriptionExist && checkPrescriptionExist.id) {
            return res.send({
              status: "error",
              message: "Prescription Id already exist",
            });
          }

          const checkPatientExist = await db.findOne("patient", ["id"], {
            hospital_patient_id: +req.body.hospital_patient_id,
            hospital_id: +req.body.hospital_id,
          });

          if (!checkPatientExist || !checkPatientExist.id) {
            if (!req.body.patient_details) {
              return res.send({
                status: "error",
                message: "Patient Details required ",
              });
            }
            if (!req.body.patient_details.first_name) {
              return res.send({
                status: "error",
                message: "Patient Name required ",
              });
            }

            const patient_details = req.body.patient_details;
            const newPatientData = await db
              .query(
                "INSERT INTO patient(hospital_id,hospital_patient_id,first_name,middle_name,last_name,gender,street_address,city,zip,state) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id;",
                [
                  +req.body.hospital_id,
                  req.body.hospital_patient_id,
                  patient_details.first_name ? patient_details.first_name : "",
                  patient_details.middle_name
                    ? patient_details.middle_name
                    : "",
                  patient_details.last_name ? patient_details.last_name : "",
                  patient_details.gender ? patient_details.gender : "",
                  patient_details.street_address
                    ? patient_details.street_address
                    : "",
                  patient_details.city ? patient_details.city : "",
                  patient_details.zip ? patient_details.zip : "",
                  patient_details.state ? patient_details.state : "",
                ]
              )
              .catch((err) => {
                console.log("error occured");
                console.log(err);
                return res.send({
                  status: "Error",
                  message: "Something went wrong",
                });
              });
            console.log("newPatientData ", newPatientData);
            patient_id = newPatientData.rows[0].id;
          } else {
            patient_id = checkPatientExist.id;
          }

          const checkDoctorExist = await db.query(
            "SELECT id FROM doctor where hospital_doctor_id = $1 and hospital_id = $2;",
            [+req.body.hospital_doctor_id, +req.body.hospital_id]
          );

          if (!checkDoctorExist.rows[0]) {
            if (!req.body.doctor_details) {
              return res.send({
                status: "error",
                message: "Doctor Details required ",
              });
            }
            if (!req.body.doctor_details.first_name) {
              return res.send({
                status: "error",
                message: "Doctor Name required ",
              });
            }

            const doctor_details = req.body.doctor_details;
            const newDoctorData = await db
              .query(
                "INSERT INTO doctor(hospital_id,hospital_doctor_id,first_name,middle_name,last_name,gender,street_address,city,zip,state) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;",
                [
                  +req.body.hospital_id,
                  req.body.hospital_doctor_id,
                  doctor_details.first_name ? doctor_details.first_name : "",
                  doctor_details.middle_name ? doctor_details.middle_name : "",
                  doctor_details.last_name ? doctor_details.last_name : "",
                  doctor_details.gender ? doctor_details.gender : "",
                  doctor_details.street_address
                    ? doctor_details.street_address
                    : "",
                  doctor_details.city ? doctor_details.city : "",
                  doctor_details.zip ? doctor_details.zip : "",
                  doctor_details.state ? doctor_details.state : "",
                ]
              )
              .catch((err) => {
                console.log("error occured");
                return res.send({
                  status: "Error",
                  message: "Something went wrong",
                });
              });
            doctor_id = newDoctorData.rows[0].id;
          } else {
            doctor_id = checkDoctorExist.rows[0].id;
          }

          const checkPharmacyExist = await db.query(
            "SELECT id FROM pharmacy where hospital_pharmacy_id = $1 and hospital_id = $2;",
            [+req.body.hospital_pharmacy_id, +req.body.hospital_id]
          );

          if (!checkPharmacyExist.rows[0]) {
            if (!req.body.pharmacy_details) {
              return res.send({
                status: "error",
                message: "Pharmacy Details required ",
              });
            }

            if (!req.body.pharmacy_details.name) {
              return res.send({
                status: "error",
                message: "Pharmacy Name required ",
              });
            }
            const pharmacy_details = req.body.pharmacy_details;
            const newPharmacyData = await db
              .query(
                "INSERT INTO pharmacy(hospital_id,hospital_pharmacy_id,name,street_address,city,zip,state) values($1,$2,$3,$4,$5,$6,$7) RETURNING *;",
                [
                  +req.body.hospital_id,
                  req.body.hospital_pharmacy_id,
                  pharmacy_details.name ? pharmacy_details.name : "",
                  pharmacy_details.street_address
                    ? pharmacy_details.street_address
                    : "",
                  pharmacy_details.city ? pharmacy_details.city : "",
                  pharmacy_details.zip ? pharmacy_details.zip : "",
                  pharmacy_details.state ? pharmacy_details.state : "",
                ]
              )
              .catch((err) => {
                console.log("error occured");
                return res.send({
                  status: "Error",
                  message: "Something went wrong",
                });
              });
            pharmacy_id = newPharmacyData.rows[0].id;
          } else {
            pharmacy_id = checkPharmacyExist.rows[0].id;
          }

          const data = await db.create(
            "prescription",
            {
              hospital_patient_id: +req.body.hospital_patient_id,
              hospital_doctor_id: +req.body.hospital_doctor_id,
              hospital_prescription_id: +req.body.hospital_prescription_id,
              hospital_pharmacy_id: +req.body.hospital_pharmacy_id,
              patient_id,
              doctor_id,
              pharmacy_id,
              hospital_id: +req.body.hospital_id,
            },
            ["hospital_prescription_id", "hospital_id"]
          );

          console.log(data);
          for (let i = 0; i < drugs.length; i++) {
            await db.create("prescription_drug", {
              hospital_id: +req.body.hospital_id,
              prescription_id: data.id,
              hospital_prescription_id: +req.body.hospital_prescription_id,
              refills: drugs[i].refills === null ? null : +drugs[i].refills,
              refills_balance:
                drugs[i].refills === null ? null : +drugs[i].refills,
              drug_code: drugs[i].drug_code,
              duration: drugs[i].duration === null ? null : +drugs[i].duration,
              frequency:
                drugs[i].frequency === null ? null : +drugs[i].frequency,
            });
          }

          return res.send({
            status: "success",
            message: "Prescription added successfully",
          });
        } catch (error) {
          console.log(error);
          return res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/hospital/updateprescription",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let patient_id, pharmacy_id, doctor_id;

          const drugs = req.body.drugs;
          console.log("\n\n\n", typeof drugs, drugs[0]);

          if (!drugs || !drugs[0]) {
            return res.send({
              status: "error",
              message: " Drugs is required ",
            });
          }

          if (typeof drugs != "object") {
            return res.send({
              status: "error",
              message: " Drugs should be array of object ",
            });
          }
          for (let i = 0; i < drugs.length; i++) {
            if (!drugs[i].drug_code) {
              return res.send({
                status: "error",
                message: " Drug code is required for index " + i,
              });
            }
          }

          if (
            req.body.hospital_patient_id === null ||
            req.body.hospital_patient_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital Patient Id is required ",
            });

          if (
            req.body.hospital_doctor_id === null ||
            req.body.hospital_doctor_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital Doctor Id is required ",
            });

          if (
            req.body.hospital_prescription_id === null ||
            req.body.hospital_prescription_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital Prescription Id is required ",
            });

          if (
            req.body.hospital_pharmacy_id === null ||
            req.body.hospital_pharmacy_id === undefined
          )
            return res.send({
              status: "error",
              message: " Hospital Pharmacy Id is required ",
            });

          const checkPrescriptionExist = await db.query(
            "SELECT id FROM prescription where hospital_prescription_id = $1 and hospital_id = $2;",
            [+req.body.hospital_prescription_id, +req.body.hospital_id]
          );

          if (!checkPrescriptionExist.rows[0]) {
            return res.send({
              status: "error",
              message: "Prescription Id does not exist",
            });
          }

          const checkPatientExist = await db.query(
            "SELECT id FROM patient where hospital_patient_id = $1 and hospital_id = $2;",
            [+req.body.hospital_patient_id, +req.body.hospital_id]
          );

          if (!checkPatientExist.rows[0]) {
            if (!req.body.patient_details) {
              return res.send({
                status: "error",
                message: "Patient Details required ",
              });
            }
            if (!req.body.patient_details.first_name) {
              return res.send({
                status: "error",
                message: "Patient Name required ",
              });
            }

            const patient_details = req.body.patient_details;
            const newPatientData = await db
              .query(
                "INSERT INTO patient(hospital_id,hospital_patient_id,first_name,middle_name,last_name,gender,street_address,city,zip,state) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id;",
                [
                  +req.body.hospital_id,
                  req.body.hospital_patient_id,
                  patient_details.first_name ? patient_details.first_name : "",
                  patient_details.middle_name
                    ? patient_details.middle_name
                    : "",
                  patient_details.last_name ? patient_details.last_name : "",
                  patient_details.gender ? patient_details.gender : "",
                  patient_details.street_address
                    ? patient_details.street_address
                    : "",
                  patient_details.city ? patient_details.city : "",
                  patient_details.zip ? patient_details.zip : "",
                  patient_details.state ? patient_details.state : "",
                ]
              )
              .catch((err) => {
                console.log("error occured");
                console.log(err);
                return res.send({
                  status: "Error",
                  message: "Something went wrong",
                });
              });
            patient_id = newPatientData.rows[0].id;
          } else {
            patient_id = checkPatientExist.rows[0].id;
          }

          const checkDoctorExist = await db.query(
            "SELECT id FROM doctor where hospital_doctor_id = $1 and hospital_id = $2;",
            [+req.body.hospital_doctor_id, +req.body.hospital_id]
          );

          if (!checkDoctorExist.rows[0]) {
            if (!req.body.doctor_details) {
              return res.send({
                status: "error",
                message: "Doctor Details required ",
              });
            }
            if (!req.body.doctor_details.first_name) {
              return res.send({
                status: "error",
                message: "Doctor Name required ",
              });
            }

            const doctor_details = req.body.doctor_details;
            const newDoctorData = await db
              .query(
                "INSERT INTO doctor(hospital_id,hospital_doctor_id,first_name,middle_name,last_name,gender,street_address,city,zip,state) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;",
                [
                  +req.body.hospital_id,
                  req.body.hospital_doctor_id,
                  doctor_details.first_name ? doctor_details.first_name : "",
                  doctor_details.middle_name ? doctor_details.middle_name : "",
                  doctor_details.last_name ? doctor_details.last_name : "",
                  doctor_details.gender ? doctor_details.gender : "",
                  doctor_details.street_address
                    ? doctor_details.street_address
                    : "",
                  doctor_details.city ? doctor_details.city : "",
                  doctor_details.zip ? doctor_details.zip : "",
                  doctor_details.state ? doctor_details.state : "",
                ]
              )
              .catch((err) => {
                console.log("error occured");
                return res.send({
                  status: "Error",
                  message: "Something went wrong",
                });
              });
            doctor_id = newDoctorData.rows[0].id;
          } else {
            doctor_id = checkDoctorExist.rows[0].id;
          }

          const checkPharmacyExist = await db.query(
            "SELECT id FROM pharmacy where hospital_pharmacy_id = $1 and hospital_id = $2;",
            [+req.body.hospital_pharmacy_id, +req.body.hospital_id]
          );

          if (!checkPharmacyExist.rows[0]) {
            if (!req.body.pharmacy_details) {
              return res.send({
                status: "error",
                message: "Pharmacy Details required ",
              });
            }

            if (!req.body.pharmacy_details.name) {
              return res.send({
                status: "error",
                message: "Pharmacy Name required ",
              });
            }
            const pharmacy_details = req.body.pharmacy_details;
            const newPharmacyData = await db
              .query(
                "INSERT INTO pharmacy(hospital_id,hospital_pharmacy_id,name,street_address,city,zip,state) values($1,$2,$3,$4,$5,$6,$7) RETURNING *;",
                [
                  +req.body.hospital_id,
                  req.body.hospital_pharmacy_id,
                  pharmacy_details.name ? pharmacy_details.name : "",
                  pharmacy_details.street_address
                    ? pharmacy_details.street_address
                    : "",
                  pharmacy_details.city ? pharmacy_details.city : "",
                  pharmacy_details.zip ? pharmacy_details.zip : "",
                  pharmacy_details.state ? pharmacy_details.state : "",
                ]
              )
              .catch((err) => {
                console.log("error occured");
                return res.send({
                  status: "Error",
                  message: "Something went wrong",
                });
              });
            pharmacy_id = newPharmacyData.rows[0].id;
          } else {
            pharmacy_id = checkPharmacyExist.rows[0].id;
          }

          const data = await db.update(
            "prescription",
            {
              hospital_patient_id: +req.body.hospital_patient_id,
              hospital_doctor_id: +req.body.hospital_doctor_id,
              hospital_pharmacy_id: +req.body.hospital_pharmacy_id,
              patient_id,
              doctor_id,
              pharmacy_id,
            },
            {
              hospital_id: req.body.hospital_id,
              hospital_prescription_id: +req.body.hospital_prescription_id,
            }
          );

          const existingDrugs = await db.findAll(
            "prescription_drug",
            ["id", "drug_code"],
            {
              hospital_id: req.body.hospital_id,
              hospital_prescription_id: +req.body.hospital_prescription_id,
            }
          );
          const prescription_data = await db.findOne("prescription", ["id"], {
            hospital_id: req.body.hospital_id,
            hospital_prescription_id: +req.body.hospital_prescription_id,
          });
          console.log("prescription_data", prescription_data);
          let newDrugList = {};
          let prevDrugList = {};
          for (let i = 0; i < drugs.length; i++) {
            newDrugList[drugs[i].drug_code] = "1";
          }
          console.log("new drug list ", newDrugList);
          // checking and removing drugs not on list
          if (existingDrugs && existingDrugs[0]) {
            for (let i = 0; i < existingDrugs.length; i++) {
              prevDrugList[existingDrugs[i].drug_code] = "1";
              console.log(
                "check ",
                existingDrugs[i].drug_code,
                " in ",
                newDrugList[existingDrugs[i].drug_code]
              );
              if (!newDrugList[existingDrugs[i].drug_code]) {
                console.log(
                  " drug code ",
                  existingDrugs[i].drug_code,
                  " doesnt exist "
                );
                await db.destroy("prescription_drug", {
                  id: existingDrugs[i].id,
                });
              }
            }
          }
          console.log("prev drug list ", prevDrugList);
          for (let i = 0; i < drugs.length; i++) {
            if (prevDrugList[drugs[i].drug_code]) {
              console.log("update drug ", drugs[i].drug_code);
              await db.update(
                "prescription_drug",
                {
                  refills: drugs[i].refills === null ? null : +drugs[i].refills,
                  refills_balance:
                    drugs[i].refills_balance === null ||
                    drugs[i].refills_balance === undefined
                      ? null
                      : +drugs[i].refills_balance,
                  duration:
                    drugs[i].duration === null ? null : +drugs[i].duration,
                  frequency:
                    drugs[i].frequency === null ? null : +drugs[i].frequency,
                },
                {
                  hospital_id: +req.body.hospital_id,
                  hospital_prescription_id: +req.body.hospital_prescription_id,
                  drug_code: drugs[i].drug_code,
                }
              );
            } else {
              console.log("create drug ", drugs[i].drug_code);
              await db.create(
                "prescription_drug",
                {
                  hospital_id: +req.body.hospital_id,
                  prescription_id: prescription_data.id,
                  hospital_prescription_id: +req.body.hospital_prescription_id,
                  refills: drugs[i].refills === null ? null : +drugs[i].refills,
                  refills_balance:
                    drugs[i].refills === null || drugs[i].refills === undefined
                      ? null
                      : +drugs[i].refills,
                  drug_code: drugs[i].drug_code,
                  duration:
                    drugs[i].duration === null ? null : +drugs[i].duration,
                  frequency:
                    drugs[i].frequency === null ? null : +drugs[i].frequency,
                },
                ["hospital_id", "hospital_prescription_id", "drug_code"]
              );
            }
          }

          return res.send({
            status: "success",
            message: "Prescription updated successfully",
          });
        } catch (error) {
          console.log(error);
          return res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/hospital/deleteprescription",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (
            req.body.hospital_prescription_id === null ||
            req.body.hospital_prescription_id === undefined
          )
            return res.send({
              status: "error",
              message: " hospital prescription Id is required ",
            });
          const data = await db.query(
            "select id from prescription where hospital_id=$1 and hospital_prescription_id = $2",
            [req.body.hospital_id, +req.body.hospital_prescription_id]
          );
          if (!data.rows[0]) {
            return res.send({
              status: "error",
              message: "Prescription does not exist",
            });
          }

          const data2 = await db.query(
            "delete from prescription where hospital_id=$1 and hospital_prescription_id = $2",
            [req.body.hospital_id, +req.body.hospital_prescription_id]
          );
          await db.destroy("prescription_drug", {
            hospital_id: req.body.hospital_id,
            hospital_prescription_id: +req.body.hospital_prescription_id,
          });
          if (data2.rowCount) {
            return res.send({
              status: "success",
              message: "Prescription deleted Successfully",
            });
          } else {
            return res.send({
              status: "error",
              message: "Something went wrong",
            });
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
      "/hospital/getprescriptions/:num",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = [],
          queryString = "";
        // const order = req.body.order ? req.body.order : "id";
        // const order_by = req.body.order_by ? req.body.order_by : "DESC";
        // let order_arr = [];
        let offset = req.params.num;
        let limit = req.body.limit ? req.body.limit : 10;

        if (req.body.drug_code != null) {
          where.push(req.body.drug_code);
          queryString += " and prescription.drug_code=$" + (where.length + 1);
        }

        if (req.body.frequency != null) {
          where.push(+req.body.frequency);
          queryString += " and prescription.frequency=$" + (where.length + 1);
        }

        if (req.body.duration != null) {
          where.push(+req.body.duration);
          queryString += " and prescription.duration=$" + (where.length + 1);
        }

        if (req.body.refills != null) {
          where.push(+req.body.refills);
          queryString += " and prescription.refills=$" + (where.length + 1);
        }

        if (req.body.hospital_patient_id != null) {
          where.push(+req.body.hospital_patient_id);
          queryString +=
            " and prescription.hospital_patient_id=$" + (where.length + 1);
        }

        if (req.body.hospital_doctor_id != null) {
          where.push(+req.body.hospital_doctor_id);
          queryString +=
            " and prescription.hospital_doctor_id=$" + (where.length + 1);
        }

        if (req.body.hospital_prescription_id != null) {
          where.push(+req.body.hospital_prescription_id);
          queryString +=
            " and prescription.hospital_prescription_id=$" + (where.length + 1);
        }

        if (req.body.hospital_pharmacy_id != null) {
          where.push(+req.body.hospital_pharmacy_id);
          queryString +=
            " and prescription.hospital_pharmacy_id=$" + (where.length + 1);
        }

        queryString += " offset " + offset * limit + " limit " + limit;
        console.log(queryString);
        try {
          const prescriptions = await db
            .query(
              "SELECT hospital_prescription_id,drug_code,frequency,duration,refills,prescription.hospital_patient_id,patient.first_name as patient_first_name,patient.middle_name as patient_middle_name,patient.last_name as patient_last_name,prescription.hospital_doctor_id,doctor.first_name as doctor_first_name, doctor.middle_name as doctor_middle_name,doctor.last_name as doctor_last_name, prescription.hospital_pharmacy_id,pharmacy.name as pharmacy_name from prescription,patient,doctor,pharmacy where prescription.hospital_id = patient.hospital_id and prescription.hospital_id = doctor.hospital_id and prescription.hospital_id = pharmacy.hospital_id and prescription.hospital_patient_id = patient.hospital_patient_id and prescription.hospital_doctor_id = doctor.hospital_doctor_id and prescription.hospital_pharmacy_id = pharmacy.hospital_pharmacy_id and prescription.hospital_id = $1 " +
                queryString,
              [+req.body.hospital_id, ...where]
            )
            .catch((err) => {
              console.log(err);
              return res.send({
                status: "error",
                message: "Something went wrong",
              });
            });
          return res.send(prescriptions.rows);
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
      "/hospital/getprescriptions",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = [],
          where2 = [],
          queryString = "",
          queryString2 = "";
        // const order = req.body.order ? req.body.order : "id";
        // const order_by = req.body.order_by ? req.body.order_by : "DESC";
        // let order_arr = [];

        if (req.body.drug_code != null) {
          where2.push(req.body.drug_code);
          queryString2 +=
            " and prescription_drug.drug_code=$" + (where.length + 1);
        }
        if (req.body.frequency != null) {
          where2.push(+req.body.frequency);
          queryString2 +=
            " and prescription_drug.frequency=$" + (where.length + 1);
        }

        if (req.body.duration != null) {
          where2.push(+req.body.duration);
          queryString2 +=
            " and prescription_drug.duration=$" + (where.length + 1);
        }

        if (req.body.refills != null) {
          where2.push(+req.body.refills);
          queryString2 +=
            " and prescription_drug.refills=$" + (where.length + 1);
        }

        if (req.body.hospital_patient_id != null) {
          where.push(+req.body.hospital_patient_id);
          queryString +=
            " and prescription.hospital_patient_id=$" + (where.length + 1);
        }

        if (req.body.hospital_doctor_id != null) {
          where.push(+req.body.hospital_doctor_id);
          queryString +=
            " and prescription.hospital_doctor_id=$" + (where.length + 1);
        }

        if (req.body.hospital_prescription_id != null) {
          where.push(+req.body.hospital_prescription_id);
          queryString +=
            " and prescription.hospital_prescription_id=$" + (where.length + 1);
        }

        if (req.body.hospital_pharmacy_id != null) {
          where.push(+req.body.hospital_pharmacy_id);
          queryString +=
            " and prescription.hospital_pharmacy_id=$" + (where.length + 1);
        }

        try {
          const prescriptions = await db
            .query(
              "SELECT  prescription.hospital_prescription_id,prescription.hospital_patient_id,patient.first_name as patient_first_name,patient.middle_name as patient_middle_name,patient.last_name as patient_last_name,prescription.hospital_doctor_id,doctor.first_name as doctor_first_name, doctor.middle_name as doctor_middle_name,doctor.last_name as doctor_last_name, prescription.hospital_pharmacy_id,pharmacy.name as pharmacy_name from prescription,patient,doctor,pharmacy where prescription.hospital_id = patient.hospital_id and prescription.hospital_id = doctor.hospital_id and prescription.hospital_id = pharmacy.hospital_id and prescription.hospital_patient_id = patient.hospital_patient_id and prescription.hospital_doctor_id = doctor.hospital_doctor_id and prescription.hospital_pharmacy_id = pharmacy.hospital_pharmacy_id and prescription.hospital_id = $1 " +
                queryString,
              [+req.body.hospital_id, ...where]
            )
            .catch((err) => {
              console.log(err);
              return res.send({
                status: "error",
                message: "Something went wrong",
              });
            });

          console.log("\n\n\n\nprescriptions ", prescriptions, "\n\n\n");

          for (let i = 0; i < prescriptions.rows.length; i++) {
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
                hospital_prescription_id:
                  prescriptions.rows[i].hospital_prescription_id,
              }
            );
            prescriptions.rows[i]["drugs"] = drugs;
          }
          return res.send(prescriptions.rows);
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
      "/hospital/getprescription",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
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
  },
};
