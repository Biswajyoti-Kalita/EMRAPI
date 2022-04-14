

			$(document).ready(function(){
				getPrescriptions();
			});

			var PrescriptionTableOffset = 0;
			var PrescriptionTableLimit = 10;
			var PrescriptionTableOrderField = 'id';
			var PrescriptionTableOrderFieldBy = 'DESC';

			function updatePrescriptionsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+PrescriptionTableOrderField+"Sort"+PrescriptionTableOrderFieldBy).removeClass("fade-l");
			}

			function getPrescriptions(searchObj) {
				
				updatePrescriptionsTableHeaderSort();


				  	const data = {
				    	offset: PrescriptionTableOffset,
				    	limit : PrescriptionTableLimit,
				    	order: PrescriptionTableOrderField,
				    	order_by: PrescriptionTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getprescriptions",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#prescriptionTableBody").html('');

				       $("#addPrescription").html("");  
				       $("#editPrescription").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#prescriptionTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Prescription')" type="checkbox" class=" checkbox-Prescription "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].drug_code ? result[i].drug_code : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].frequency ? result[i].frequency : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].duration ? result[i].duration : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].refills ? result[i].refills : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].patient_id ? result[i].patient_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].doctor_id ? result[i].doctor_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].pharmacy_id ? result[i].pharmacy_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_id ? result[i].hospital_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_patient_id ? result[i].hospital_patient_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_doctor_id ? result[i].hospital_doctor_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_prescription_id ? result[i].hospital_prescription_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_pharmacy_id ? result[i].hospital_pharmacy_id : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editPrescriptionModal(  '${result[i].drug_code}', '${result[i].frequency}', '${result[i].duration}', '${result[i].refills}', '${result[i].patient_id}', '${result[i].doctor_id}', '${result[i].pharmacy_id}', '${result[i].hospital_id}', '${result[i].hospital_patient_id}', '${result[i].hospital_doctor_id}', '${result[i].hospital_prescription_id}', '${result[i].hospital_pharmacy_id}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deletePrescriptionModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changePrescriptionsTableOffset,PrescriptionTableLimit,PrescriptionTableOffset,'Prescription')
				    },
				  });
				}


				function changePrescriptionsTableOffset(num) {
					PrescriptionTableOffset  = num;
					getPrescriptions();
				}
				function changePrescriptionsTableLimit(num) {
					PrescriptionTableLimit  = num;
					getPrescriptions();
				}
				function changePrescriptionsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					PrescriptionTableOrderField  = order_field;
					PrescriptionTableOrderFieldBy  = order_field_by;
					getPrescriptions();
				}


		
				var tempForm = "";
				$("#searchPrescriptionForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchPrescriptionForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getPrescriptions(searchObj);
				})
			
				function addPrescription() {
				  $.ajax({
				    url: "/admin/addprescription",
				    method: "POST",
				    data: {
				    	drug_code :  $("#addPrescriptionDrugCodeInput").val() ,frequency :  $("#addPrescriptionFrequencyInput").val() ,duration :  $("#addPrescriptionDurationInput").val() ,refills :  $("#addPrescriptionRefillsInput").val() ,patient_id :  $("#addPrescriptionPatientIdInput").val() ,doctor_id :  $("#addPrescriptionDoctorIdInput").val() ,pharmacy_id :  $("#addPrescriptionPharmacyIdInput").val() ,hospital_id :  $("#addPrescriptionHospitalIdInput").val() ,hospital_patient_id :  $("#addPrescriptionHospitalPatientIdInput").val() ,hospital_doctor_id :  $("#addPrescriptionHospitalDoctorIdInput").val() ,hospital_prescription_id :  $("#addPrescriptionHospitalPrescriptionIdInput").val() ,hospital_pharmacy_id :  $("#addPrescriptionHospitalPharmacyIdInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addPrescriptionForm input, #addPrescriptionForm textarea").val('')
				        $("#addPrescriptionModal").modal('hide');
				        swal({
				          title: "Prescription Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPrescriptions();
				      }
				      else 
				        swal({
				          title: "Unsuccessfully",
				          text: result.message,
				          icon: "error",
				          button: "Okay",
				        });
				    },
				  });
				}
			
				$("#addPrescriptionForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addPrescription();
				})
				function addPrescriptionModal(){
				  $("#addPrescriptionModal").modal('show');					
				}
			
				function updatePrescription()  {
				  $.ajax({
				    url: "/admin/updateprescription",
				    method: "POST",
				    data: {
				    	drug_code : $("#editPrescriptionDrugCodeInput").val(),frequency : $("#editPrescriptionFrequencyInput").val(),duration : $("#editPrescriptionDurationInput").val(),refills : $("#editPrescriptionRefillsInput").val(),patient_id : $("#editPrescriptionPatientIdInput").val(),doctor_id : $("#editPrescriptionDoctorIdInput").val(),pharmacy_id : $("#editPrescriptionPharmacyIdInput").val(),hospital_id : $("#editPrescriptionHospitalIdInput").val(),hospital_patient_id : $("#editPrescriptionHospitalPatientIdInput").val(),hospital_doctor_id : $("#editPrescriptionHospitalDoctorIdInput").val(),hospital_prescription_id : $("#editPrescriptionHospitalPrescriptionIdInput").val(),hospital_pharmacy_id : $("#editPrescriptionHospitalPharmacyIdInput").val(),id : $("#editPrescriptionId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editPrescriptionForm input, #editPrescriptionForm textarea").val('')
				        $("#editPrescriptionModal").modal('hide');
				        swal({
				          title: "Prescription Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPrescriptions();
				      }
				      else 
				        swal({
				          title: "Unsuccessfully",
				          text: result.message,
				          icon: "error",
				          button: "Okay",
				        });

				    },
				  });
				}
			
				function editPrescriptionModal(drug_code,frequency,duration,refills,patient_id,doctor_id,pharmacy_id,hospital_id,hospital_patient_id,hospital_doctor_id,hospital_prescription_id,hospital_pharmacy_id,id) {
				  $("#editPrescriptionModal").modal('show');
				  $("#editPrescriptionId").val(id);
				  $("#editDrugCodeInput").val(drug_code);$("#editFrequencyInput").val(frequency);$("#editDurationInput").val(duration);$("#editRefillsInput").val(refills);$("#editPatientIdInput").val(patient_id);$("#editDoctorIdInput").val(doctor_id);$("#editPharmacyIdInput").val(pharmacy_id);$("#editHospitalIdInput").val(hospital_id);$("#editHospitalPatientIdInput").val(hospital_patient_id);$("#editHospitalDoctorIdInput").val(hospital_doctor_id);$("#editHospitalPrescriptionIdInput").val(hospital_prescription_id);$("#editHospitalPharmacyIdInput").val(hospital_pharmacy_id);
				}
				$("#editPrescriptionForm").on('submit',(ev) => {
					ev.preventDefault();
					updatePrescription();
				})

			
				function deletePrescription(id) {
				  $.ajax({
				    url: "/admin/deleteprescription",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Prescription Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPrescriptions();
				      }
				      else 
				        swal({
				          title: "Unsuccessfully",
				          text: result.message,
				          icon: "error",
				          button: "Okay",
				        });
				    },
				  });
				}
			

				async function deletePrescriptionModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deletePrescription(id);
				  }
				}
			
				function bulkDeletePrescription(ids) {
				  $.ajax({
				    url: "/admin/bulkdeleteprescription",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Prescriptions Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPrescriptions();
				      }
				      else 
				        swal({
				          title: "Unsuccessfully",
				          text: result.message,
				          icon: "error",
				          button: "Okay",
				        });
				    },
				  });
				}
			

				async function bulkDeletePrescriptionModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeletePrescription(ids);
				  }
				};

			