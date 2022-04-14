

			$(document).ready(function(){
				getDiseases();
			});

			var DiseaseTableOffset = 0;
			var DiseaseTableLimit = 10;
			var DiseaseTableOrderField = 'id';
			var DiseaseTableOrderFieldBy = 'DESC';

			function updateDiseasesTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+DiseaseTableOrderField+"Sort"+DiseaseTableOrderFieldBy).removeClass("fade-l");
			}

			function getDiseases(searchObj) {
				
				updateDiseasesTableHeaderSort();


				  	const data = {
				    	offset: DiseaseTableOffset,
				    	limit : DiseaseTableLimit,
				    	order: DiseaseTableOrderField,
				    	order_by: DiseaseTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getdiseases",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#diseaseTableBody").html('');

				       $("#addDisease").html("");  
				       $("#editDisease").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#diseaseTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Disease')" type="checkbox" class=" checkbox-Disease "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].disease_name ? result[i].disease_name : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].semantic_brand_name ? result[i].semantic_brand_name : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editDiseaseModal(  '${result[i].disease_name}', '${result[i].semantic_brand_name}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteDiseaseModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeDiseasesTableOffset,DiseaseTableLimit,DiseaseTableOffset,'Disease')
				    },
				  });
				}


				function changeDiseasesTableOffset(num) {
					DiseaseTableOffset  = num;
					getDiseases();
				}
				function changeDiseasesTableLimit(num) {
					DiseaseTableLimit  = num;
					getDiseases();
				}
				function changeDiseasesTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					DiseaseTableOrderField  = order_field;
					DiseaseTableOrderFieldBy  = order_field_by;
					getDiseases();
				}


		
				var tempForm = "";
				$("#searchDiseaseForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchDiseaseForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getDiseases(searchObj);
				})
			
				function addDisease() {
				  $.ajax({
				    url: "/admin/adddisease",
				    method: "POST",
				    data: {
				    	disease_name :  $("#addDiseaseDiseaseNameInput").val() ,semantic_brand_name :  $("#addDiseaseSemanticBrandNameInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addDiseaseForm input, #addDiseaseForm textarea").val('')
				        $("#addDiseaseModal").modal('hide');
				        swal({
				          title: "Disease Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDiseases();
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
			
				$("#addDiseaseForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addDisease();
				})
				function addDiseaseModal(){
				  $("#addDiseaseModal").modal('show');					
				}
			
				function updateDisease()  {
				  $.ajax({
				    url: "/admin/updatedisease",
				    method: "POST",
				    data: {
				    	disease_name : $("#editDiseaseDiseaseNameInput").val(),semantic_brand_name : $("#editDiseaseSemanticBrandNameInput").val(),id : $("#editDiseaseId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editDiseaseForm input, #editDiseaseForm textarea").val('')
				        $("#editDiseaseModal").modal('hide');
				        swal({
				          title: "Disease Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDiseases();
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
			
				function editDiseaseModal(disease_name,semantic_brand_name,id) {
				  $("#editDiseaseModal").modal('show');
				  $("#editDiseaseId").val(id);
				  $("#editDiseaseNameInput").val(disease_name);$("#editSemanticBrandNameInput").val(semantic_brand_name);
				}
				$("#editDiseaseForm").on('submit',(ev) => {
					ev.preventDefault();
					updateDisease();
				})

			
				function deleteDisease(id) {
				  $.ajax({
				    url: "/admin/deletedisease",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Disease Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDiseases();
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
			

				async function deleteDiseaseModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteDisease(id);
				  }
				}
			
				function bulkDeleteDisease(ids) {
				  $.ajax({
				    url: "/admin/bulkdeletedisease",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Diseases Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getDiseases();
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
			

				async function bulkDeleteDiseaseModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteDisease(ids);
				  }
				};

			