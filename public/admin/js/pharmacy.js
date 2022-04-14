

			$(document).ready(function(){
				getPharmacys();
			});

			var PharmacyTableOffset = 0;
			var PharmacyTableLimit = 10;
			var PharmacyTableOrderField = 'id';
			var PharmacyTableOrderFieldBy = 'DESC';

			function updatePharmacysTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+PharmacyTableOrderField+"Sort"+PharmacyTableOrderFieldBy).removeClass("fade-l");
			}

			function getPharmacys(searchObj) {
				
				updatePharmacysTableHeaderSort();


				  	const data = {
				    	offset: PharmacyTableOffset,
				    	limit : PharmacyTableLimit,
				    	order: PharmacyTableOrderField,
				    	order_by: PharmacyTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getpharmacies",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#pharmacyTableBody").html('');

				       $("#addPharmacy").html("");  
				       $("#editPharmacy").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#pharmacyTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Pharmacy')" type="checkbox" class=" checkbox-Pharmacy "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].name ? result[i].name : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].street_address ? result[i].street_address : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].city ? result[i].city : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].zip ? result[i].zip : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].state ? result[i].state : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_pharmacy_id ? result[i].hospital_pharmacy_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].pharmacist_id ? result[i].pharmacist_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].hospital_id ? result[i].hospital_id : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editPharmacyModal(  '${result[i].name}', '${result[i].street_address}', '${result[i].city}', '${result[i].zip}', '${result[i].state}', '${result[i].hospital_pharmacy_id}', '${result[i].pharmacist_id}', '${result[i].hospital_id}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deletePharmacyModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changePharmacysTableOffset,PharmacyTableLimit,PharmacyTableOffset,'Pharmacy')
				    },
				  });
				}


				function changePharmacysTableOffset(num) {
					PharmacyTableOffset  = num;
					getPharmacys();
				}
				function changePharmacysTableLimit(num) {
					PharmacyTableLimit  = num;
					getPharmacys();
				}
				function changePharmacysTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					PharmacyTableOrderField  = order_field;
					PharmacyTableOrderFieldBy  = order_field_by;
					getPharmacys();
				}


		
				var tempForm = "";
				$("#searchPharmacyForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchPharmacyForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getPharmacys(searchObj);
				})
			
				function addPharmacy() {
				  $.ajax({
				    url: "/admin/addpharmacy",
				    method: "POST",
				    data: {
				    	name :  $("#addPharmacyNameInput").val() ,street_address :  $("#addPharmacyStreetAddressInput").val() ,city :  $("#addPharmacyCityInput").val() ,zip :  $("#addPharmacyZipInput").val() ,state :  $("#addPharmacyStateInput").val() ,hospital_pharmacy_id :  $("#addPharmacyHospitalPharmacyIdInput").val() ,pharmacist_id :  $("#addPharmacyPharmacistIdInput").val() ,hospital_id :  $("#addPharmacyHospitalIdInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addPharmacyForm input, #addPharmacyForm textarea").val('')
				        $("#addPharmacyModal").modal('hide');
				        swal({
				          title: "Pharmacy Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPharmacys();
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
			
				$("#addPharmacyForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addPharmacy();
				})
				function addPharmacyModal(){
				  $("#addPharmacyModal").modal('show');					
				}
			
				function updatePharmacy()  {
				  $.ajax({
				    url: "/admin/updatepharmacy",
				    method: "POST",
				    data: {
				    	name : $("#editPharmacyNameInput").val(),street_address : $("#editPharmacyStreetAddressInput").val(),city : $("#editPharmacyCityInput").val(),zip : $("#editPharmacyZipInput").val(),state : $("#editPharmacyStateInput").val(),hospital_pharmacy_id : $("#editPharmacyHospitalPharmacyIdInput").val(),pharmacist_id : $("#editPharmacyPharmacistIdInput").val(),hospital_id : $("#editPharmacyHospitalIdInput").val(),id : $("#editPharmacyId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editPharmacyForm input, #editPharmacyForm textarea").val('')
				        $("#editPharmacyModal").modal('hide');
				        swal({
				          title: "Pharmacy Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPharmacys();
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
			
				function editPharmacyModal(name,street_address,city,zip,state,hospital_pharmacy_id,pharmacist_id,hospital_id,id) {
				  $("#editPharmacyModal").modal('show');
				  $("#editPharmacyId").val(id);
				  $("#editNameInput").val(name);$("#editStreetAddressInput").val(street_address);$("#editCityInput").val(city);$("#editZipInput").val(zip);$("#editStateInput").val(state);$("#editHospitalPharmacyIdInput").val(hospital_pharmacy_id);$("#editPharmacistIdInput").val(pharmacist_id);$("#editHospitalIdInput").val(hospital_id);
				}
				$("#editPharmacyForm").on('submit',(ev) => {
					ev.preventDefault();
					updatePharmacy();
				})

			
				function deletePharmacy(id) {
				  $.ajax({
				    url: "/admin/deletepharmacy",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Pharmacy Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPharmacys();
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
			

				async function deletePharmacyModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deletePharmacy(id);
				  }
				}
			
				function bulkDeletePharmacy(ids) {
				  $.ajax({
				    url: "/admin/bulkdeletepharmacy",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Pharmacies Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getPharmacys();
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
			

				async function bulkDeletePharmacyModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeletePharmacy(ids);
				  }
				};

			