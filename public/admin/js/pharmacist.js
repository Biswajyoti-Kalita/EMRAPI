

			$(document).ready(function(){
				getPharmacists();
			});

			var PharmacistTableOffset = 0;
			var PharmacistTableLimit = 10;
			var PharmacistTableOrderField = 'id';
			var PharmacistTableOrderFieldBy = 'DESC';

			function updatePharmacistsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+PharmacistTableOrderField+"Sort"+PharmacistTableOrderFieldBy).removeClass("fade-l");
			}

			function getPharmacists(searchObj) {
				
				updatePharmacistsTableHeaderSort();


				  	const data = {
				    	offset: PharmacistTableOffset,
				    	limit : PharmacistTableLimit,
				    	order: PharmacistTableOrderField,
				    	order_by: PharmacistTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getpharmacists",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#pharmacistTableBody").html('');

				       $("#addPharmacist").html("");  
				       $("#editPharmacist").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#pharmacistTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Pharmacist')" type="checkbox" class=" checkbox-Pharmacist "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_id ? result[i].hospital_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_pharmacist_id ? result[i].hospital_pharmacist_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].user_id ? result[i].user_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].pharmacy_id ? result[i].pharmacy_id : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editPharmacistModal(  '${result[i].hospital_id}', '${result[i].hospital_pharmacist_id}', '${result[i].user_id}', '${result[i].pharmacy_id}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deletePharmacistModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changePharmacistsTableOffset,PharmacistTableLimit,PharmacistTableOffset,'Pharmacist')
				    },
				  });
				}


				function changePharmacistsTableOffset(num) {
					PharmacistTableOffset  = num;
					getPharmacists();
				}
				function changePharmacistsTableLimit(num) {
					PharmacistTableLimit  = num;
					getPharmacists();
				}
				function changePharmacistsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					PharmacistTableOrderField  = order_field;
					PharmacistTableOrderFieldBy  = order_field_by;
					getPharmacists();
				}


		
				var tempForm = "";
				$("#searchPharmacistForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchPharmacistForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getPharmacists(searchObj);
				})
			
				function addPharmacist() {
				  $.ajax({
				    url: "/admin/addpharmacist",
				    method: "POST",
				    data: {
				    	hospital_id :  $("#addPharmacistHospitalIdInput").val() ,hospital_pharmacist_id :  $("#addPharmacistHospitalPharmacistIdInput").val() ,user_id :  $("#addPharmacistUserIdInput").val() ,pharmacy_id :  $("#addPharmacistPharmacyIdInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addPharmacistForm input, #addPharmacistForm textarea").val('')
				        $("#addPharmacistModal").modal('hide');
				        swal({
				          title: "Pharmacist Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPharmacists();
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
			
				$("#addPharmacistForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addPharmacist();
				})
				function addPharmacistModal(){
				  $("#addPharmacistModal").modal('show');					
				}
			
				function updatePharmacist()  {
				  $.ajax({
				    url: "/admin/updatepharmacist",
				    method: "POST",
				    data: {
				    	hospital_id : $("#editPharmacistHospitalIdInput").val(),hospital_pharmacist_id : $("#editPharmacistHospitalPharmacistIdInput").val(),user_id : $("#editPharmacistUserIdInput").val(),pharmacy_id : $("#editPharmacistPharmacyIdInput").val(),id : $("#editPharmacistId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editPharmacistForm input, #editPharmacistForm textarea").val('')
				        $("#editPharmacistModal").modal('hide');
				        swal({
				          title: "Pharmacist Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPharmacists();
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
			
				function editPharmacistModal(hospital_id,hospital_pharmacist_id,user_id,pharmacy_id,id) {
				  $("#editPharmacistModal").modal('show');
				  $("#editPharmacistId").val(id);
				  $("#editHospitalIdInput").val(hospital_id);$("#editHospitalPharmacistIdInput").val(hospital_pharmacist_id);$("#editUserIdInput").val(user_id);$("#editPharmacyIdInput").val(pharmacy_id);
				}
				$("#editPharmacistForm").on('submit',(ev) => {
					ev.preventDefault();
					updatePharmacist();
				})

			
				function deletePharmacist(id) {
				  $.ajax({
				    url: "/admin/deletepharmacist",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Pharmacist Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPharmacists();
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
			

				async function deletePharmacistModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deletePharmacist(id);
				  }
				}
			
				function bulkDeletePharmacist(ids) {
				  $.ajax({
				    url: "/admin/bulkdeletepharmacist",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Pharmacists Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPharmacists();
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
			

				async function bulkDeletePharmacistModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeletePharmacist(ids);
				  }
				};

			