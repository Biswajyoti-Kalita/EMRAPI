

			$(document).ready(function(){
				getAdmins();
			});

			var AdminTableOffset = 0;
			var AdminTableLimit = 10;
			var AdminTableOrderField = 'id';
			var AdminTableOrderFieldBy = 'DESC';

			function updateAdminsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+AdminTableOrderField+"Sort"+AdminTableOrderFieldBy).removeClass("fade-l");
			}

			function getAdmins(searchObj) {
				
				updateAdminsTableHeaderSort();


				  	const data = {
				    	offset: AdminTableOffset,
				    	limit : AdminTableLimit,
				    	order: AdminTableOrderField,
				    	order_by: AdminTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getadmins",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#adminTableBody").html('');

				       $("#addAdmin").html("");  
				       $("#editAdmin").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#adminTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Admin')" type="checkbox" class=" checkbox-Admin "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].name ? result[i].name : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].email ? result[i].email : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].password ? result[i].password : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].access_token ? result[i].access_token : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].type admin_type ? result[i].type admin_type : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_id ? result[i].hospital_id : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editAdminModal(  '${result[i].name}', '${result[i].email}', '${result[i].password}', '${result[i].access_token}', '${result[i].type admin_type}', '${result[i].hospital_id}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteAdminModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeAdminsTableOffset,AdminTableLimit,AdminTableOffset,'Admin')
				    },
				  });
				}


				function changeAdminsTableOffset(num) {
					AdminTableOffset  = num;
					getAdmins();
				}
				function changeAdminsTableLimit(num) {
					AdminTableLimit  = num;
					getAdmins();
				}
				function changeAdminsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					AdminTableOrderField  = order_field;
					AdminTableOrderFieldBy  = order_field_by;
					getAdmins();
				}


		
				var tempForm = "";
				$("#searchAdminForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchAdminForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getAdmins(searchObj);
				})
			
				function addAdmin() {
				  $.ajax({
				    url: "/admin/addadmin",
				    method: "POST",
				    data: {
				    	name :  $("#addAdminNameInput").val() ,email :  $("#addAdminEmailInput").val() ,password :  $("#addAdminPasswordInput").val() ,access_token :  $("#addAdminAccessTokenInput").val() ,type admin_type :  $("#addAdminTypeAdminTypeInput").val() ,hospital_id :  $("#addAdminHospitalIdInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addAdminForm input, #addAdminForm textarea").val('')
				        $("#addAdminModal").modal('hide');
				        swal({
				          title: "Admin Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getAdmins();
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
			
				$("#addAdminForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addAdmin();
				})
				function addAdminModal(){
				  $("#addAdminModal").modal('show');					
				}
			
				function updateAdmin()  {
				  $.ajax({
				    url: "/admin/updateadmin",
				    method: "POST",
				    data: {
				    	name : $("#editAdminNameInput").val(),email : $("#editAdminEmailInput").val(),password : $("#editAdminPasswordInput").val(),access_token : $("#editAdminAccessTokenInput").val(),type admin_type : $("#editAdminTypeAdminTypeInput").val(),hospital_id : $("#editAdminHospitalIdInput").val(),id : $("#editAdminId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editAdminForm input, #editAdminForm textarea").val('')
				        $("#editAdminModal").modal('hide');
				        swal({
				          title: "Admin Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getAdmins();
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
			
				function editAdminModal(name,email,password,access_token,type admin_type,hospital_id,id) {
				  $("#editAdminModal").modal('show');
				  $("#editAdminId").val(id);
				  $("#editNameInput").val(name);$("#editEmailInput").val(email);$("#editPasswordInput").val(password);$("#editAccessTokenInput").val(access_token);$("#editTypeAdminTypeInput").val(type admin_type);$("#editHospitalIdInput").val(hospital_id);
				}
				$("#editAdminForm").on('submit',(ev) => {
					ev.preventDefault();
					updateAdmin();
				})

			
				function deleteAdmin(id) {
				  $.ajax({
				    url: "/admin/deleteadmin",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Admin Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getAdmins();
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
			

				async function deleteAdminModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteAdmin(id);
				  }
				}
			
				function bulkDeleteAdmin(ids) {
				  $.ajax({
				    url: "/admin/bulkdeleteadmin",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Admins Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getAdmins();
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
			

				async function bulkDeleteAdminModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteAdmin(ids);
				  }
				};

			