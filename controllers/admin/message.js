
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
var file_upload = require('./../../services/upload');
var roleService = require('./../../services/roleService');
var passwordService = require('./../../services/passwordService');


module.exports = {
    initializeApi: function(app) {
        const basic_attributes = ["createdAt","updatedAt"];


const role = 0;
					app.post("/admin/addmessage",roleService.verifyRole(role),   async function(req, res) {
					    try {

							
							  if(req.body.sender_id === null || req.body.sender_id === undefined)
								  return res.send({status  : "error", message : " Sender Id is required " })
						  
							  if(req.body.receiver_id === null || req.body.receiver_id === undefined)
								  return res.send({status  : "error", message : " Receiver Id is required " })
						  
							  if(req.body.sender_type === null || req.body.sender_type === undefined)
								  return res.send({status  : "error", message : " Sender Type is required " })
						  
							  if(req.body.receiver_type === null || req.body.receiver_type === undefined)
								  return res.send({status  : "error", message : " Receiver Type is required " })
						  
							  if(req.body.message === null || req.body.message === undefined)
								  return res.send({status  : "error", message : " Message is required " })
						  


					        await db.message.create({
		
			sender_id : req.body.sender_id,
		
			receiver_id : req.body.receiver_id,
		
			sender_type : req.body.sender_type,
		
			receiver_type : req.body.receiver_type,
		
			message : req.body.message,
		
			
		
	});
					        res.send({
					            status: "success",
					            message: "done",
					        });
					    } catch (error) {
					        res.send({
					            status: "error",
					            message: error,
					        });
					    }
					});
				
					app.post("/admin/updatemessage",  roleService.verifyRole(role),  async function(req, res) {
					    try {
					        await db.message.update({
		
			sender_id : req.body.sender_id,
		
			receiver_id : req.body.receiver_id,
		
			sender_type : req.body.sender_type,
		
			receiver_type : req.body.receiver_type,
		
			message : req.body.message,
		
			
		
	}, {
					            where: {
					                id: req.body.id,
					            },
					        });
					        res.send({
					            status: "success",
					            message: "done",
					        });
					    } catch (error) {
					        res.send({
					            status: "error",
					            message: error,
					        });
					    }
					});
				
					app.post("/admin/deletemessage",  roleService.verifyRole(role),  async function(req, res) {

					    try {
					        await db.message.destroy({
					            where: {
					                id: req.body.id,
					            },
					        });
					        res.send({
					            status: "success",
					            message: "Deleted Successfully",
					        });
					    } catch (error) {
					        res.send({
					            status: "error",
					            message: error,
					        });
					    }
					});
				
					app.post("/admin/bulkdeletemessage", roleService.verifyRole(role),  async function(req, res) {

						if(!req.body.ids || !Array.isArray(req.body.ids)){
							return res.send({
								status : "error",
								message: "Please send ids as array"

							})
						}


					    try {
					        await db.message.destroy({
					            where: {
					                id: {
					                	[Op.in] : req.body.ids
					                }
					            },
					        });
					        res.send({
					            status: "success",
					            message: "Deleted Successfully",
					        });
					    } catch (error) {
					        res.send({
					            status: "error",
					            message: error,
					        });
					    }
					});
				
				app.post("/admin/getmessages",  roleService.verifyRole(role),  async function(req, res) {


					let where = {};
					const order = req.body.order ? req.body.order : 'id';
					const order_by = req.body.order_by ? req.body.order_by : "DESC";
					let order_arr = [];

					if(order.indexOf(".")>=0)
					{
						const tempArr = order.split(".");
						tempArr.push(order_by);
						order_arr =[tempArr];
					}
					else{
						order_arr = [[order,order_by]];
					}

					
			
			if(req.body.sender_id != null)
				where['sender_id'] =  req.body.sender_id;
		
			if(req.body.receiver_id != null)
				where['receiver_id'] =  req.body.receiver_id;
		
			if(req.body.sender_type != null)
				where['sender_type'] =  req.body.sender_type;
		
			if(req.body.receiver_type != null)
				where['receiver_type'] =  req.body.receiver_type;
		
			if(req.body.message != null)
				where['message'] =  req.body.message;
		
	;

				    try {
					        const messages = await db.message.findAndCountAll({
					        where: where,
				        	offset : req.body.offset ? +req.body.offset : null,
				        	limit : req.body.limit ? +req.body.limit : 25,
				        	order : order_arr,
				        	include : [
				        		
		
	
				        	]
				        });
				        res.send(messages);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				
				app.post("/admin/getmessage",  roleService.verifyRole(role),  async function(req, res) {
				    try {
				        const message = await db.message.findOne({
				        	where : {
				        		id : req.body.id
				        	},
				        	include : [
				        		
		
	
				        	],				        	
				        	attributes: ['id','sender_id','receiver_id','sender_type','receiver_type','message']
				        });
				        res.send(message);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				


	}
}

