

			$(document).ready(function(){
				getHospitals();
			});

			var HospitalTableOffset = 0;
			var HospitalTableLimit = 10;
			var HospitalTableOrderField = 'id';
			var HospitalTableOrderFieldBy = 'DESC';

			function updateHospitalsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+HospitalTableOrderField+"Sort"+HospitalTableOrderFieldBy).removeClass("fade-l");
			}

			function getHospitals(searchObj) {
				
				updateHospitalsTableHeaderSort();


				  	const data = {
				    	offset: HospitalTableOffset,
				    	limit : HospitalTableLimit,
				    	order: HospitalTableOrderField,
				    	order_by: HospitalTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/gethospitals",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#hospitalTableBody").html('');

				       $("#addHospital").html("");  
				       $("#editHospital").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#hospitalTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Hospital')" type="checkbox" class=" checkbox-Hospital "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].name ? result[i].name : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].street_address ? result[i].street_address : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].city ? result[i].city : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].zip ? result[i].zip : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].state ? result[i].state : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editHospitalModal(  '${result[i].name}', '${result[i].street_address}', '${result[i].city}', '${result[i].zip}', '${result[i].state}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteHospitalModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeHospitalsTableOffset,HospitalTableLimit,HospitalTableOffset,'Hospital')
				    },
				  });
				}


				function changeHospitalsTableOffset(num) {
					HospitalTableOffset  = num;
					getHospitals();
				}
				function changeHospitalsTableLimit(num) {
					HospitalTableLimit  = num;
					getHospitals();
				}
				function changeHospitalsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					HospitalTableOrderField  = order_field;
					HospitalTableOrderFieldBy  = order_field_by;
					getHospitals();
				}


		
				var tempForm = "";
				$("#searchHospitalForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchHospitalForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getHospitals(searchObj);
				})
			
				function addHospital() {
				  $.ajax({
				    url: "/admin/addhospital",
				    method: "POST",
				    data: {
				    	name :  $("#addHospitalNameInput").val() ,street_address :  $("#addHospitalStreetAddressInput").val() ,city :  $("#addHospitalCityInput").val() ,zip :  $("#addHospitalZipInput").val() ,state :  $("#addHospitalStateInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addHospitalForm input, #addHospitalForm textarea").val('')
				        $("#addHospitalModal").modal('hide');
				        swal({
				          title: "Hospital Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getHospitals();
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
			
				$("#addHospitalForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addHospital();
				})
				function addHospitalModal(){
				  $("#addHospitalModal").modal('show');					
				}
			
				function updateHospital()  {
				  $.ajax({
				    url: "/admin/updatehospital",
				    method: "POST",
				    data: {
				    	name : $("#editHospitalNameInput").val(),street_address : $("#editHospitalStreetAddressInput").val(),city : $("#editHospitalCityInput").val(),zip : $("#editHospitalZipInput").val(),state : $("#editHospitalStateInput").val(),id : $("#editHospitalId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editHospitalForm input, #editHospitalForm textarea").val('')
				        $("#editHospitalModal").modal('hide');
				        swal({
				          title: "Hospital Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getHospitals();
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
			
				function editHospitalModal(name,street_address,city,zip,state,id) {
				  $("#editHospitalModal").modal('show');
				  $("#editHospitalId").val(id);
				  $("#editNameInput").val(name);$("#editStreetAddressInput").val(street_address);$("#editCityInput").val(city);$("#editZipInput").val(zip);$("#editStateInput").val(state);
				}
				$("#editHospitalForm").on('submit',(ev) => {
					ev.preventDefault();
					updateHospital();
				})

			
				function deleteHospital(id) {
				  $.ajax({
				    url: "/admin/deletehospital",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Hospital Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getHospitals();
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
			

				async function deleteHospitalModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteHospital(id);
				  }
				}
			
				function bulkDeleteHospital(ids) {
				  $.ajax({
				    url: "/admin/bulkdeletehospital",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Hospitals Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getHospitals();
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
			

				async function bulkDeleteHospitalModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteHospital(ids);
				  }
				};

			