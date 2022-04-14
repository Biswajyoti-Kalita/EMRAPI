

			$(document).ready(function(){
				getPatients();
			});

			var PatientTableOffset = 0;
			var PatientTableLimit = 10;
			var PatientTableOrderField = 'id';
			var PatientTableOrderFieldBy = 'DESC';

			function updatePatientsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+PatientTableOrderField+"Sort"+PatientTableOrderFieldBy).removeClass("fade-l");
			}

			function getPatients(searchObj) {
				
				updatePatientsTableHeaderSort();


				  	const data = {
				    	offset: PatientTableOffset,
				    	limit : PatientTableLimit,
				    	order: PatientTableOrderField,
				    	order_by: PatientTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getpatients",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#patientTableBody").html('');

				       $("#addPatient").html("");  
				       $("#editPatient").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#patientTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Patient')" type="checkbox" class=" checkbox-Patient "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_id ? result[i].hospital_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_patient_id ? result[i].hospital_patient_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].first_name ? result[i].first_name : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].middle_name ? result[i].middle_name : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].last_name ? result[i].last_name : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].gender ? result[i].gender : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].photo ? result[i].photo : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].signature ? result[i].signature : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].street_address ? result[i].street_address : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].city ? result[i].city : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].zip ? result[i].zip : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].state ? result[i].state : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editPatientModal(  '${result[i].hospital_id}', '${result[i].hospital_patient_id}', '${result[i].first_name}', '${result[i].middle_name}', '${result[i].last_name}', '${result[i].gender}', '${result[i].photo}', '${result[i].signature}', '${result[i].street_address}', '${result[i].city}', '${result[i].zip}', '${result[i].state}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deletePatientModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changePatientsTableOffset,PatientTableLimit,PatientTableOffset,'Patient')
				    },
				  });
				}


				function changePatientsTableOffset(num) {
					PatientTableOffset  = num;
					getPatients();
				}
				function changePatientsTableLimit(num) {
					PatientTableLimit  = num;
					getPatients();
				}
				function changePatientsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					PatientTableOrderField  = order_field;
					PatientTableOrderFieldBy  = order_field_by;
					getPatients();
				}


		
				var tempForm = "";
				$("#searchPatientForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchPatientForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getPatients(searchObj);
				})
			
				function addPatient() {
				  $.ajax({
				    url: "/admin/addpatient",
				    method: "POST",
				    data: {
				    	hospital_id :  $("#addPatientHospitalIdInput").val() ,hospital_patient_id :  $("#addPatientHospitalPatientIdInput").val() ,first_name :  $("#addPatientFirstNameInput").val() ,middle_name :  $("#addPatientMiddleNameInput").val() ,last_name :  $("#addPatientLastNameInput").val() ,gender :  $("#addPatientGenderInput").val() ,photo :  $("#addPatientPhotoInput").val() ,signature :  $("#addPatientSignatureInput").val() ,street_address :  $("#addPatientStreetAddressInput").val() ,city :  $("#addPatientCityInput").val() ,zip :  $("#addPatientZipInput").val() ,state :  $("#addPatientStateInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addPatientForm input, #addPatientForm textarea").val('')
				        $("#addPatientModal").modal('hide');
				        swal({
				          title: "Patient Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPatients();
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
			
				$("#addPatientForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addPatient();
				})
				function addPatientModal(){
				  $("#addPatientModal").modal('show');					
				}
			
				function updatePatient()  {
				  $.ajax({
				    url: "/admin/updatepatient",
				    method: "POST",
				    data: {
				    	hospital_id : $("#editPatientHospitalIdInput").val(),hospital_patient_id : $("#editPatientHospitalPatientIdInput").val(),first_name : $("#editPatientFirstNameInput").val(),middle_name : $("#editPatientMiddleNameInput").val(),last_name : $("#editPatientLastNameInput").val(),gender : $("#editPatientGenderInput").val(),photo : $("#editPatientPhotoInput").val(),signature : $("#editPatientSignatureInput").val(),street_address : $("#editPatientStreetAddressInput").val(),city : $("#editPatientCityInput").val(),zip : $("#editPatientZipInput").val(),state : $("#editPatientStateInput").val(),id : $("#editPatientId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editPatientForm input, #editPatientForm textarea").val('')
				        $("#editPatientModal").modal('hide');
				        swal({
				          title: "Patient Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPatients();
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
			
				function editPatientModal(hospital_id,hospital_patient_id,first_name,middle_name,last_name,gender,photo,signature,street_address,city,zip,state,id) {
				  $("#editPatientModal").modal('show');
				  $("#editPatientId").val(id);
				  $("#editHospitalIdInput").val(hospital_id);$("#editHospitalPatientIdInput").val(hospital_patient_id);$("#editFirstNameInput").val(first_name);$("#editMiddleNameInput").val(middle_name);$("#editLastNameInput").val(last_name);$("#editGenderInput").val(gender);$("#editPhotoInput").val(photo);$("#editSignatureInput").val(signature);$("#editStreetAddressInput").val(street_address);$("#editCityInput").val(city);$("#editZipInput").val(zip);$("#editStateInput").val(state);
				}
				$("#editPatientForm").on('submit',(ev) => {
					ev.preventDefault();
					updatePatient();
				})

			
				function deletePatient(id) {
				  $.ajax({
				    url: "/admin/deletepatient",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Patient Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPatients();
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
			

				async function deletePatientModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deletePatient(id);
				  }
				}
			
				function bulkDeletePatient(ids) {
				  $.ajax({
				    url: "/admin/bulkdeletepatient",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Patients Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPatients();
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
			

				async function bulkDeletePatientModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeletePatient(ids);
				  }
				};

			