

			$(document).ready(function(){
				getDrug_disease_refs();
			});

			var Drug_disease_refTableOffset = 0;
			var Drug_disease_refTableLimit = 10;
			var Drug_disease_refTableOrderField = 'id';
			var Drug_disease_refTableOrderFieldBy = 'DESC';

			function updateDrug_disease_refsTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+Drug_disease_refTableOrderField+"Sort"+Drug_disease_refTableOrderFieldBy).removeClass("fade-l");
			}

			function getDrug_disease_refs(searchObj) {
				
				updateDrug_disease_refsTableHeaderSort();


				  	const data = {
				    	offset: Drug_disease_refTableOffset,
				    	limit : Drug_disease_refTableLimit,
				    	order: Drug_disease_refTableOrderField,
				    	order_by: Drug_disease_refTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getdrug_disease_refs",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#drug_disease_refTableBody").html('');

				       $("#addDrug_disease_ref").html("");  
				       $("#editDrug_disease_ref").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#drug_disease_refTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Drug_disease_ref')" type="checkbox" class=" checkbox-Drug_disease_ref "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].drug_id ? result[i].drug_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].disease_id ? result[i].disease_id : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editDrug_disease_refModal(  '${result[i].drug_id}', '${result[i].disease_id}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteDrug_disease_refModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeDrug_disease_refsTableOffset,Drug_disease_refTableLimit,Drug_disease_refTableOffset,'Drug_disease_ref')
				    },
				  });
				}


				function changeDrug_disease_refsTableOffset(num) {
					Drug_disease_refTableOffset  = num;
					getDrug_disease_refs();
				}
				function changeDrug_disease_refsTableLimit(num) {
					Drug_disease_refTableLimit  = num;
					getDrug_disease_refs();
				}
				function changeDrug_disease_refsTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					Drug_disease_refTableOrderField  = order_field;
					Drug_disease_refTableOrderFieldBy  = order_field_by;
					getDrug_disease_refs();
				}


		
				var tempForm = "";
				$("#searchDrug_disease_refForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchDrug_disease_refForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getDrug_disease_refs(searchObj);
				})
			
				function addDrug_disease_ref() {
				  $.ajax({
				    url: "/admin/adddrug_disease_ref",
				    method: "POST",
				    data: {
				    	drug_id :  $("#addDrugDiseaseRefDrugIdInput").val() ,disease_id :  $("#addDrugDiseaseRefDiseaseIdInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addDrug_disease_refForm input, #addDrug_disease_refForm textarea").val('')
				        $("#addDrug_disease_refModal").modal('hide');
				        swal({
				          title: "Drug_disease_ref Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDrug_disease_refs();
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
			
				$("#addDrug_disease_refForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addDrug_disease_ref();
				})
				function addDrug_disease_refModal(){
				  $("#addDrug_disease_refModal").modal('show');					
				}
			
				function updateDrug_disease_ref()  {
				  $.ajax({
				    url: "/admin/updatedrug_disease_ref",
				    method: "POST",
				    data: {
				    	drug_id : $("#editDrugDiseaseRefDrugIdInput").val(),disease_id : $("#editDrugDiseaseRefDiseaseIdInput").val(),id : $("#editDrug_disease_refId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editDrug_disease_refForm input, #editDrug_disease_refForm textarea").val('')
				        $("#editDrug_disease_refModal").modal('hide');
				        swal({
				          title: "Drug_disease_ref Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDrug_disease_refs();
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
			
				function editDrug_disease_refModal(drug_id,disease_id,id) {
				  $("#editDrug_disease_refModal").modal('show');
				  $("#editDrug_disease_refId").val(id);
				  $("#editDrugIdInput").val(drug_id);$("#editDiseaseIdInput").val(disease_id);
				}
				$("#editDrug_disease_refForm").on('submit',(ev) => {
					ev.preventDefault();
					updateDrug_disease_ref();
				})

			
				function deleteDrug_disease_ref(id) {
				  $.ajax({
				    url: "/admin/deletedrug_disease_ref",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Drug_disease_ref Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDrug_disease_refs();
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
			

				async function deleteDrug_disease_refModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteDrug_disease_ref(id);
				  }
				}
			
				function bulkDeleteDrug_disease_ref(ids) {
				  $.ajax({
				    url: "/admin/bulkdeletedrug_disease_ref",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Drug_disease_refs Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDrug_disease_refs();
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
			

				async function bulkDeleteDrug_disease_refModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteDrug_disease_ref(ids);
				  }
				};

			