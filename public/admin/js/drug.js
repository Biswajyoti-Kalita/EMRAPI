

			$(document).ready(function(){
				getDrugs();
			});

			var DrugTableOffset = 0;
			var DrugTableLimit = 10;
			var DrugTableOrderField = 'id';
			var DrugTableOrderFieldBy = 'DESC';

			function updateDrugsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+DrugTableOrderField+"Sort"+DrugTableOrderFieldBy).removeClass("fade-l");
			}

			function getDrugs(searchObj) {
				
				updateDrugsTableHeaderSort();


				  	const data = {
				    	offset: DrugTableOffset,
				    	limit : DrugTableLimit,
				    	order: DrugTableOrderField,
				    	order_by: DrugTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getdrugs",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#drugTableBody").html('');

				       $("#addDrug").html("");  
				       $("#editDrug").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#drugTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Drug')" type="checkbox" class=" checkbox-Drug "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].drug_code ? result[i].drug_code : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].durg_name ? result[i].durg_name : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].semantic_brand_name ? result[i].semantic_brand_name : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editDrugModal(  '${result[i].drug_code}', '${result[i].durg_name}', '${result[i].semantic_brand_name}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteDrugModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeDrugsTableOffset,DrugTableLimit,DrugTableOffset,'Drug')
				    },
				  });
				}


				function changeDrugsTableOffset(num) {
					DrugTableOffset  = num;
					getDrugs();
				}
				function changeDrugsTableLimit(num) {
					DrugTableLimit  = num;
					getDrugs();
				}
				function changeDrugsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					DrugTableOrderField  = order_field;
					DrugTableOrderFieldBy  = order_field_by;
					getDrugs();
				}


		
				var tempForm = "";
				$("#searchDrugForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchDrugForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getDrugs(searchObj);
				})
			
				function addDrug() {
				  $.ajax({
				    url: "/admin/adddrug",
				    method: "POST",
				    data: {
				    	drug_code :  $("#addDrugDrugCodeInput").val() ,durg_name :  $("#addDrugDurgNameInput").val() ,semantic_brand_name :  $("#addDrugSemanticBrandNameInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addDrugForm input, #addDrugForm textarea").val('')
				        $("#addDrugModal").modal('hide');
				        swal({
				          title: "Drug Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDrugs();
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
			
				$("#addDrugForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addDrug();
				})
				function addDrugModal(){
				  $("#addDrugModal").modal('show');					
				}
			
				function updateDrug()  {
				  $.ajax({
				    url: "/admin/updatedrug",
				    method: "POST",
				    data: {
				    	drug_code : $("#editDrugDrugCodeInput").val(),durg_name : $("#editDrugDurgNameInput").val(),semantic_brand_name : $("#editDrugSemanticBrandNameInput").val(),id : $("#editDrugId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editDrugForm input, #editDrugForm textarea").val('')
				        $("#editDrugModal").modal('hide');
				        swal({
				          title: "Drug Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDrugs();
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
			
				function editDrugModal(drug_code,durg_name,semantic_brand_name,id) {
				  $("#editDrugModal").modal('show');
				  $("#editDrugId").val(id);
				  $("#editDrugCodeInput").val(drug_code);$("#editDurgNameInput").val(durg_name);$("#editSemanticBrandNameInput").val(semantic_brand_name);
				}
				$("#editDrugForm").on('submit',(ev) => {
					ev.preventDefault();
					updateDrug();
				})

			
				function deleteDrug(id) {
				  $.ajax({
				    url: "/admin/deletedrug",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Drug Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDrugs();
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
			

				async function deleteDrugModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteDrug(id);
				  }
				}
			
				function bulkDeleteDrug(ids) {
				  $.ajax({
				    url: "/admin/bulkdeletedrug",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Drugs Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDrugs();
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
			

				async function bulkDeleteDrugModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteDrug(ids);
				  }
				};

			