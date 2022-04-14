

			$(document).ready(function(){
				getMessages();
			});

			var MessageTableOffset = 0;
			var MessageTableLimit = 10;
			var MessageTableOrderField = 'id';
			var MessageTableOrderFieldBy = 'DESC';

			function updateMessagesTableHeaderSort(){
				$(".sort-icon").addClass("fade-l");
				$("#"+MessageTableOrderField+"Sort"+MessageTableOrderFieldBy).removeClass("fade-l");
			}

			function getMessages(searchObj) {
				
				updateMessagesTableHeaderSort();


				  	const data = {
				    	offset: MessageTableOffset,
				    	limit : MessageTableLimit,
				    	order: MessageTableOrderField,
				    	order_by: MessageTableOrderFieldBy,
				      	token: Cookies.get("token"),
				    };

				    if(searchObj){
				    	for(key in searchObj){
				    		data[key] = searchObj[key];
				    	}
				    }

				  $.ajax({
				    url: "/admin/getmessages",
				    method: "POST",
				    data: data,
				    success: function (resultData) {
				      console.log(result);      
				      var result = resultData.rows;
				      var count = resultData.count;
				      $("#messageTableBody").html('');

				       $("#addMessage").html("");  
				       $("#editMessage").html("");  


				      for (var i = 0; i < result.length; i++) {
				        $("#messageTableBody").append(`
				          <tr>
				          	<td> <input onclick="checkSelected('Message')" type="checkbox" class=" checkbox-Message "  data-id="${result[i].id}" /> </td>
					<td>${ result[i] ? result[i].id ? result[i].id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].sender_id ? result[i].sender_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].receiver_id ? result[i].receiver_id : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].sender_type ? result[i].sender_type : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].receiver_type ? result[i].receiver_type : ' '  : ' '  }</td>
					<td>${ result[i] ? result[i].message ? result[i].message : ' '  : ' '  }</td><td><span class="btn btn-link btn-sm" onclick="editMessageModal(  '${result[i].sender_id}', '${result[i].receiver_id}', '${result[i].sender_type}', '${result[i].receiver_type}', '${result[i].message}', ${result[i].id} )">Edit</span><span class="btn btn-link btn-sm" onclick="deleteMessageModal(${result[i].id})">Delete</span></td>
				          </tr>
				        `);
				      }
				      getPaginate(count,changeMessagesTableOffset,MessageTableLimit,MessageTableOffset,'Message')
				    },
				  });
				}


				function changeMessagesTableOffset(num) {
					MessageTableOffset  = num;
					getMessages();
				}
				function changeMessagesTableLimit(num) {
					MessageTableLimit  = num;
					getMessages();
				}
				function changeMessagesTableOrder(order_field,order_field_by) {

					console.log(order_field,order_field_by);

					MessageTableOrderField  = order_field;
					MessageTableOrderFieldBy  = order_field_by;
					getMessages();
				}


		
				var tempForm = "";
				$("#searchMessageForm").on('submit',(ev) => {
					ev.preventDefault();
					console.log(ev);
					tempForm = ev;
					var searchObj ={};
					$("#searchMessageForm").serializeArray().map((i) => {
						if(i.value)
							searchObj[i.name] = i.value;
					});
					getMessages(searchObj);
				})
			
				function addMessage() {
				  $.ajax({
				    url: "/admin/addmessage",
				    method: "POST",
				    data: {
				    	sender_id :  $("#addMessageSenderIdInput").val() ,receiver_id :  $("#addMessageReceiverIdInput").val() ,sender_type :  $("#addMessageSenderTypeInput").val() ,receiver_type :  $("#addMessageReceiverTypeInput").val() ,message :  $("#addMessageMessageInput").val() ,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#addMessageForm input, #addMessageForm textarea").val('')
				        $("#addMessageModal").modal('hide');
				        swal({
				          title: "Message Added successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getMessages();
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
			
				$("#addMessageForm").on('submit',(ev) => {
				  ev.preventDefault();
				  addMessage();
				})
				function addMessageModal(){
				  $("#addMessageModal").modal('show');					
				}
			
				function updateMessage()  {
				  $.ajax({
				    url: "/admin/updatemessage",
				    method: "POST",
				    data: {
				    	sender_id : $("#editMessageSenderIdInput").val(),receiver_id : $("#editMessageReceiverIdInput").val(),sender_type : $("#editMessageSenderTypeInput").val(),receiver_type : $("#editMessageReceiverTypeInput").val(),message : $("#editMessageMessageInput").val(),id : $("#editMessageId").val(),				    
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				      	$("#editMessageForm input, #editMessageForm textarea").val('')
				        $("#editMessageModal").modal('hide');
				        swal({
				          title: "Message Updated successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getMessages();
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
			
				function editMessageModal(sender_id,receiver_id,sender_type,receiver_type,message,id) {
				  $("#editMessageModal").modal('show');
				  $("#editMessageId").val(id);
				  $("#editSenderIdInput").val(sender_id);$("#editReceiverIdInput").val(receiver_id);$("#editSenderTypeInput").val(sender_type);$("#editReceiverTypeInput").val(receiver_type);$("#editMessageInput").val(message);
				}
				$("#editMessageForm").on('submit',(ev) => {
					ev.preventDefault();
					updateMessage();
				})

			
				function deleteMessage(id) {
				  $.ajax({
				    url: "/admin/deletemessage",
				    method: "POST",
				    data: {
				      id : id,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Message Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getMessages();
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
			

				async function deleteMessageModal(id) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    deleteMessage(id);
				  }
				}
			
				function bulkDeleteMessage(ids) {
				  $.ajax({
				    url: "/admin/bulkdeletemessage",
				    method: "POST",
				    data: {
				      ids : ids,
				      token: Cookies.get("token"),
				    },
				    success: function (result) {
				      console.log(result);
				      if(result.status == "success"){
				        swal({
				          title: "Messages Deleted successfully",
				          text: result.message,
				          icon: "success",
				          button: "Okay",
				        });
				        getMessages();
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
			

				async function bulkDeleteMessageModal(ids) {  
				  const res = await swal({
				              title: "Are you sure?",
				              text: "",
				              icon: "warning",
				              buttons: true,
				              dangerMode: true,
				            });
				  console.log(res);
				  if(res){
				    bulkDeleteMessage(ids);
				  }
				};

			