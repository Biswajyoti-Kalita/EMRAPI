

			$(document).ready(function(){
				getDoctors();
			});

			var DoctorTableOffset = 0;
			var DoctorTableLimit = 10;
			var DoctorTableOrderField = 'id';
			var DoctorTableOrderFieldBy = 'DESC';

			function updateDoctorsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+DoctorTableOrderField+"Sort"+DoctorTableOrderFieldBy).removeClass("fade-l");
			}

			function getDoctors(searchObj) {
				
				updateDoctorsTableHeaderSort();


				  	const data = {
				    	offset: DoctorTableOffset,
				    	limit : DoctorTableLimit,
				    	order: DoctorTableOrderField,
				    	order_by: DoctorTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getdoctors",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#doctorTableBody").html('');

				       $("#addDoctor").html("");  
				       $("#editDoctor").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#doctorTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Doctor')" type="checkbox" class=" checkbox-Doctor "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_id ? result[i].hospital_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_doctor_id ? result[i].hospital_doctor_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].first_name ? result[i].first_name : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].middle_name ? result[i].middle_name : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].last_name ? result[i].last_name : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].gender ? result[i].gender : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].photo ? result[i].photo : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].signature ? result[i].signature : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].street_address ? result[i].street_address : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].city ? result[i].city : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].zip ? result[i].zip : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].state ? result[i].state : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editDoctorModal(  '${result[i].hospital_id}', '${result[i].hospital_doctor_id}', '${result[i].first_name}', '${result[i].middle_name}', '${result[i].last_name}', '${result[i].gender}', '${result[i].photo}', '${result[i].signature}', '${result[i].street_address}', '${result[i].city}', '${result[i].zip}', '${result[i].state}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteDoctorModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeDoctorsTableOffset,DoctorTableLimit,DoctorTableOffset,'Doctor')
				    },
				  });
				}


				function changeDoctorsTableOffset(num) {
					DoctorTableOffset  = num;
					getDoctors();
				}
				function changeDoctorsTableLimit(num) {
					DoctorTableLimit  = num;
					getDoctors();
				}
				function changeDoctorsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					DoctorTableOrderField  = order_field;
					DoctorTableOrderFieldBy  = order_field_by;
					getDoctors();
				}


		
				var tempForm = "";
				$("#searchDoctorForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchDoctorForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getDoctors(searchObj);
				})
			
				function addDoctor() {
				  $.ajax({
				    url: "/admin/adddoctor",
				    method: "POST",
				    data: {
				    	hospital_id :  $("#addDoctorHospitalIdInput").val() ,hospital_doctor_id :  $("#addDoctorHospitalDoctorIdInput").val() ,first_name :  $("#addDoctorFirstNameInput").val() ,middle_name :  $("#addDoctorMiddleNameInput").val() ,last_name :  $("#addDoctorLastNameInput").val() ,gender :  $("#addDoctorGenderInput").val() ,photo :  $("#addDoctorPhotoInput").val() ,signature :  $("#addDoctorSignatureInput").val() ,street_address :  $("#addDoctorStreetAddressInput").val() ,city :  $("#addDoctorCityInput").val() ,zip :  $("#addDoctorZipInput").val() ,state :  $("#addDoctorStateInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addDoctorForm input, #addDoctorForm textarea").val('')
				        $("#addDoctorModal").modal('hide');
				        swal({
				          title: "Doctor Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDoctors();
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
			
				$("#addDoctorForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addDoctor();
				})
				function addDoctorModal(){
				  $("#addDoctorModal").modal('show');					
				}
			
				function updateDoctor()  {
				  $.ajax({
				    url: "/admin/updatedoctor",
				    method: "POST",
				    data: {
				    	hospital_id : $("#editDoctorHospitalIdInput").val(),hospital_doctor_id : $("#editDoctorHospitalDoctorIdInput").val(),first_name : $("#editDoctorFirstNameInput").val(),middle_name : $("#editDoctorMiddleNameInput").val(),last_name : $("#editDoctorLastNameInput").val(),gender : $("#editDoctorGenderInput").val(),photo : $("#editDoctorPhotoInput").val(),signature : $("#editDoctorSignatureInput").val(),street_address : $("#editDoctorStreetAddressInput").val(),city : $("#editDoctorCityInput").val(),zip : $("#editDoctorZipInput").val(),state : $("#editDoctorStateInput").val(),id : $("#editDoctorId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editDoctorForm input, #editDoctorForm textarea").val('')
				        $("#editDoctorModal").modal('hide');
				        swal({
				          title: "Doctor Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDoctors();
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
			
				function editDoctorModal(hospital_id,hospital_doctor_id,first_name,middle_name,last_name,gender,photo,signature,street_address,city,zip,state,id) {
				  $("#editDoctorModal").modal('show');
				  $("#editDoctorId").val(id);
				  $("#editHospitalIdInput").val(hospital_id);$("#editHospitalDoctorIdInput").val(hospital_doctor_id);$("#editFirstNameInput").val(first_name);$("#editMiddleNameInput").val(middle_name);$("#editLastNameInput").val(last_name);$("#editGenderInput").val(gender);$("#editPhotoInput").val(photo);$("#editSignatureInput").val(signature);$("#editStreetAddressInput").val(street_address);$("#editCityInput").val(city);$("#editZipInput").val(zip);$("#editStateInput").val(state);
				}
				$("#editDoctorForm").on('submit',(ev) => {
					ev.preventDefault();
					updateDoctor();
				})

			
				function deleteDoctor(id) {
				  $.ajax({
				    url: "/admin/deletedoctor",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Doctor Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDoctors();
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
			

				async function deleteDoctorModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteDoctor(id);
				  }
				}
			
				function bulkDeleteDoctor(ids) {
				  $.ajax({
				    url: "/admin/bulkdeletedoctor",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Doctors Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDoctors();
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
			

				async function bulkDeleteDoctorModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteDoctor(ids);
				  }
				};

			