/*=========================================================================================
    File Name: wizard-steps.js
    Description: wizard steps page specific js
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

$(document).ready(function () {
  'use strict';

  var bsStepper = document.querySelectorAll('.bs-stepper'),
  select = $('.select2'),
  horizontalWizard = document.querySelector('.horizontal-wizard-example'),
  verticalWizard = document.querySelector('.vertical-wizard-example'),
  modernWizard = document.querySelector('.modern-wizard-example'),
  modernVerticalWizard = document.querySelector('.modern-vertical-wizard-example');
  const milliseconds = (h, m, s) => ((h*60*60+m*60+s)*1000);
  var inbound_start_date;
  var inbound_end_date;
  var outbound_start_date;
  var outbound_end_date;
  var project_detail = {};
  var inbound_server_detail = {};
  var outbound_detail = {};
  var schedule_detail = {};
  $('#weekly_fields').hide();
  $('#weekly_fields_outbound').hide();
  $('#monthly_fields').hide();  
  $('#monthly_fields_outbound').hide(); 
  var validationRowCounter = 1;
  var inOutAutocompleteDataArray = [];
  var inboundAutocompleteDataArray = [];
  var outboundAutocompleteDataArray = [];

  // Adds crossed class
  if (typeof bsStepper !== undefined && bsStepper !== null) {
    for (var el = 0; el < bsStepper.length; ++el) {
      bsStepper[el].addEventListener('show.bs-stepper', function (event) {
        var index = event.detail.indexStep;
        var numberOfSteps = $(event.target).find('.step').length - 1;
        var line = $(event.target).find('.step');
        
        // The first for loop is for increasing the steps,
        // the second is for turning them off when going back
        // and the third with the if statement because the last line
        // can't seem to turn off when I press the first item. ??\_(???)_/??

        for (var i = 0; i < index; i++) {
          line[i].classList.add('crossed');

          for (var j = index; j < numberOfSteps; j++) {
            line[j].classList.remove('crossed');
          }
        }
        if (event.detail.to == 0) {
          for (var k = index; k < numberOfSteps; k++) {
            line[k].classList.remove('crossed');
          }
          line[0].classList.remove('crossed');
        }
      });
    }
  }

  // select2
  select.each(function () {
    var $this = $(this);
    $this.wrap('<div class="position-relative"></div>');
    $this.select2({
      placeholder: 'Select value',
      dropdownParent: $this.parent()
    });
  });

  // Horizontal Wizard
  // --------------------------------------------------------------------
  if (typeof horizontalWizard !== undefined && horizontalWizard !== null) {
    var numberedStepper = new Stepper(horizontalWizard),
    $form = $(horizontalWizard).find('form');
    $.validator.addMethod(
      "regex",
      function(value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
      },
      "DDEP API is not valid (must start with a '/' and must contain any letter, capitalize letter, number, dash or underscore)"
    );

    $.validator.addMethod(
      "pattern",
      function(value, element, regexp) {
        console.log(value);
        console.log(element);
        console.log(regexp);
        console.log((value.match(/\//g) || []).length);
        if ((value.match(/\//g) || []).length > regexp) {
          return false;
        } else {
          return true;
        }
      },
      "DDEP API is only allow 10 '/'"
    );

    $form.each(function () {
      var $this = $(this);
      $this.validate({
        rules: {
          ProjectCode: {
            required: true,
            remote : {
              type : 'POST',
              url : "/projects/checkcodeexist",
              data : {
                ProjectCode: function() { return $("#ProjectCode").val(); },
                project_id: function() { return $("#project_id").val(); },
              },
            }
          },
          ProjectName: {
            required: true,
          },
          CompanyName: {
            required: true
          },
          sync_type: {
            required: true
          },
          ftp_server_link: {
            required: true
          },
          port: {
            required: true
          },
          login_name: {
            required: true
          },
          password: {
            required: true
          },
          folderpath :{
            required:true
          },
          api_url:{
            required:true,
          },
          Schedule_configure: {
            required: true
          },
          schedule_type: {
            required: true
          },
          inbound_format: {
            required: true
          },
          recurs_count_inbound: {
            required: true,
            min:1,
            digits:true
          },
          recurs_time: {
            required: true
          },
          api_type: {
            required: true
          },
          api_user_api: {
            required: true
          },
          api_ddep_api: {
            required: true,
            maxlength: 100,
            regex: /^(\/)[a-zA-Z0-9-_\/]+$/,
            pattern: 10,
            remote : {
              type : 'POST',
              url : "/inbound_setting/checkddepinputexist",
              data : {
                api_ddep_api: function() { return $("#api_ddep_api").val(); },
                project_id: function() { return $("#project_id").val(); },
              },
            }
          },
          /*api_ddep_api_get_or_post: {
            required: true
          },*/
          api_ddep_api_receive_parameter_name: {
            required: true
          },
          one_time_occurrence_inbound_date:{
            required: "#one_time_occurrence_inbound_date:visible"
          },
          one_time_occurrence_inbound_time:{
            required:"#one_time_occurrence_inbound_time:visible"
          },
          one_time_occurrence_outbound_date:{
            required:"#one_time_occurrence_outbound_date:visible"
          },
          one_time_occurrence_outbound_time:{
            required:"#one_time_occurrence_outbound_time:visible"
          },
          daily_frequency_once_time_inbound:{
            required:"#daily_frequency_once_time_inbound:visible"
          },
          daily_frequency_once_time_outbound:{
            required:"#daily_frequency_once_time_outbound:visible"
          },
          duration_inbound_start_date:{
            required:'#duration_inbound_start_date:visible'
          },
          duration_outbound_start_date:{
            required:'#duration_outbound_start_date:visible'
          },
          daily_frequency_every_time_count_start_inbound:{
            required:'#daily_frequency_every_time_count_start_inbound:visible'
          },
          daily_frequency_every_time_count_start_outbound:{
            required:'#daily_frequency_every_time_count_start_outbound:visible'
          },
          daily_frequency_every_time_count_end_inbound:{
            required:"#daily_frequency_every_time_count_end_inbound:visible"
          },
          daily_frequency_every_time_count_end_outbound:{
            required:"#daily_frequency_every_time_count_end_outbound:visible"
          },
          duration_inbound_end_date:{
            required:'#duration_inbound_end_date:visible'
          },
          duration_outbound_end_date:{
            required:"#duration_outbound_end_date:visible"
          },
          /*InboundFormatData: {
            required: true
          },
          OutboundFormatData: {
            required: true
          },*/
        },
        messages : {
          ProjectCode : {
            required : "Project Code Is Required",
            remote : "Project Code already exists."
          },
          api_ddep_api : {
            remote : "DDEP API input already exists."
          }
        }
      });
    });

    $(horizontalWizard)
    .find('.btn-next')
    .each(function (index) {
      $(this).on('click', function (e) {
        var $e = e;
        var isValid = $(this).parent().siblings('form').valid();
        var $thisform = $(this).parent().siblings('form');
        var project_id = $('#project_id').val();

        if (isValid) {
          if(index == 0)
          {
            //var forms = $(this).parent().siblings('form');
            project_detail.ProjectCode = $('#ProjectCode').val();
            project_detail.ProjectName = $('#ProjectName').val();
            project_detail.CompanyName = $('#CompanyName').val();
            if(project_id=="")
            {
              $.ajax({
                url:'/projects/save',  
                method:'post',  
                dataType:'json',
                data:{ProjectName:project_detail.ProjectName,ProjectCode:project_detail.ProjectCode,CompanyName:project_detail.CompanyName},
                success:function(response){
                  //alert("project saved successfully");
                  $('#project_id').val(response.id);
                  //console.log(response);
                  numberedStepper.to(2);
                },
                error:function(textStatus,error)
                {
                  return false;
                }
              });
            }
            else
            {
              $.ajax({
                url:'/projects/update/'+project_id,  
                method:'put',  
                dataType:'json',
                data:{ProjectName:project_detail.ProjectName,ProjectCode:project_detail.ProjectCode,CompanyName:project_detail.CompanyName},
                success:function(response){
                  // sweetAlert("success", "Project Setting Saved Successfully", "success");
                  swal({
                    title: "success!",
                    text: "Project Setting Saved Successfully",
                    type: "success",
                    timer: 1200
                  });
                  //console.log(response);
                  numberedStepper.to(2);
                },
                error:function(textStatus,error)
                {
                  return false;
                }
              });
            }
            if(project_id!="")
            {
              editalltabs(project_id);
            }
          }
          else if(index == 1)
          {
            var check = $(this).parent().siblings('form').valid();
            if(check)
            {
              
              var project_id = $('#project_id').val();
              
              var inbound_setting_id = $("#inbound_setting_id").val();
              var inbound_format = $('#inboundFormat').val();
              var sync_type = $('input[name="sync_type"]:checked').val();
              var ftp_server_link = $('#ftp_server_link').val();

              var port = $('#port').val();
              var login_name = $('#login_name').val();
              var password = $('#password').val();
              var folder = $('#folderpath').val();
              var backup_folder = $('#backup_folder').val();
              var is_password_encrypted = $('#is_password_encrypted').val();
              var is_active = $('#is_active_inbound').data('value');
              var api_ddep_api = $('#api_ddep_api').val()==undefined ? "":$('#api_ddep_api').val();
              var api_user_api = $('#api_user_api').val()==undefined ? "":$('#api_user_api').val();
              // var api_ddep_api_get_or_post = $('input[name="api_ddep_api_get_or_post"]:checked').val();
              var api_ddep_api_receive_parameter_name = $('#api_ddep_api_receive_parameter_name').val();
              var api_type = $('input[name="api_type"]:checked').val();
              if(sync_type=="API" && api_type == 'DDEP_API')
              {
                $('#inbound_shedule_setting_tab').hide();
                $('#outbound_shedule_setting_tab').hide();
                $('#inbound_ddep_api_selected').show();
              }
              if(sync_type=="API" && api_type == 'User_API')
              {
                $('#inbound_shedule_setting_tab').show();
                $('#outbound_shedule_setting_tab').hide();
                $('#inbound_ddep_api_selected').hide();
              }
              if(sync_type=="FTP")
              {
                $('#inbound_shedule_setting_tab').show();
                $('#outbound_shedule_setting_tab').show();
                $('#inbound_ddep_api_selected').hide();
              }
              if(inbound_setting_id=="")
              {
                console.log(project_id, "ppp")
                $.ajax({
                  url:'/inbound_setting/save',  
                  method:'post',  
                  dataType:'json',
                  data:{project_id:project_id,inbound_format:inbound_format,sync_type:sync_type,ftp_server_link:ftp_server_link,port:port,login_name:login_name,password:password,is_password_encrypted:is_password_encrypted,folder:folder,backup_folder:backup_folder,api_ddep_api:api_ddep_api,api_user_api:api_user_api,api_type:api_type,is_active:is_active,api_ddep_api_receive_parameter_name:api_ddep_api_receive_parameter_name},
                  success:function(response){
                    console.log(response);
                    $("#inbound_setting_id").val(response.id);
                    numberedStepper.to(3);
                  },
                  error: function (textStatus, errorThrown) {
                   $e.preventDefault();
                  }
                });
              }
              else
              {
                $.ajax({
                  url:'/inbound_setting/update/'+inbound_setting_id,  
                  method:'put',  
                  dataType:'json',
                  data:{project_id:project_id,inbound_format:inbound_format,sync_type:sync_type,ftp_server_link:ftp_server_link,port:port,login_name:login_name,password:password,is_password_encrypted:is_password_encrypted,folder:folder,backup_folder:backup_folder,api_ddep_api:api_ddep_api,api_user_api:api_user_api,api_type:api_type,is_active:is_active,api_ddep_api_receive_parameter_name:api_ddep_api_receive_parameter_name},
                  success:function(response){
                    // $('#inbound_shedule_setting_tab').show();
                    // sweetAlert("success", "Inbound Setting Saved Successfully", "success");
                    swal({
                      title: "success!",
                      text: "Inbound Setting Saved Successfully",
                      type: "success",
                      timer: 1200
                    });
                    numberedStepper.to(3);
                  },
                  error: function (textStatus, errorThrown) {
                    $('#collapseTwo').slideDown('slow');
                    $thisform.valid();
                    return false;
                    //console.log("error in ajax");
                    
                   }
                });
              }
            }
            else
            {
              alert("not valid");
            }
          }
          else if(index == 2)
          {
            var sync_type_out =$('input[name="sync_type_out"]:checked').val();
            var api_url = $('#api_url').val();
            var outbound_format = $('#outbound_format').val();
            var outbound_setting_id = $('#outbound_setting_id').val();
            var project_id = $('#project_id').val();
            var is_active = $('#is_active_outbound').data('value');
            var check = $(this).parent().siblings('form').valid();
            if(check)
            {
              //alert("ram");
              if(outbound_setting_id=="")
              {
                $.ajax({
                  url:'/outbound_setting/save',  
                  method:'post',  
                  dataType:'json',
                  data:{project_id:project_id,sync_type_out:sync_type_out,api_url:api_url,outbound_format:outbound_format,is_active:is_active},
                  success:function(response){
                    //console.log(response);
                    //alert("Setting saved successfully");
                    $("#outbound_setting_id").val(response.id);
                    numberedStepper.to(4);
                  },
                  error:function(textStatus,errorThrown)
                  {
                    console.log("error in outbound");
                    $('#collapseFour').slideDown('slow');
                    $thisform.valid();
                    return false;
                  }
                });
              }
              else
              {
                $.ajax({
                  url:'/outbound_setting/update/'+outbound_setting_id,  
                  method:'put',  
                  dataType:'json',
                  data:{project_id:project_id,sync_type_out:sync_type_out,api_url:api_url,outbound_format:outbound_format,is_active},
                  success:function(response){
                    //console.log(response);
                    //alert("Setting saved successfully");
                    swal({
                      title: "success!",
                      text: "Outbound Setting Saved Successfully",
                      type: "success",
                      timer: 1200
                    });
                    $("#outbound_setting_id").val(outbound_setting_id);
                    numberedStepper.to(4);
                  },
                  error:function(textStatus,errorThrown)
                  { 
                    console.log("error in outbound setting");
                    $('#collapseFour').slideDown('slow');
                    $thisform.valid();
                    return false;
                  }
                });
              }
            }
            else
            {
              
            }
          }
          else if(index == 3)
          {
            var check = $(this).parent().siblings('form').valid();
            if(check)
            {
              var project_id = $('#project_id').val();
              var mapping_setting_id = $("#mapping_setting_id").val();
              var inbound_format = $("#InboundFormatData").val();
              var outbound_format = $('#OutboundFormatData').val();
              var mapping_data = $('#mySavedModel2').val();

              if(mapping_setting_id=="")
              {
                $.ajax({
                  url:'/project/item/mapping/save',  
                  method:'post',  
                  dataType:'json',
                  data:{project_id:project_id,inbound_format:inbound_format,outbound_format:outbound_format,mapping_data:mapping_data},
                  success:function(response){
                    $("#mapping_setting_id").val(response.id);
                    inboundautocompletedata(JSON.parse(inbound_format));
                    console.log(inboundAutocompleteDataArray);
                    outboundautocompletedata(JSON.parse(outbound_format));
                    console.log(outboundAutocompleteDataArray);
                    inOutAutocompleteDataArray = inboundAutocompleteDataArray.concat(outboundAutocompleteDataArray);
                    numberedStepper.to(5);
                  },
                  error: function (textStatus, errorThrown) {
                    $e.preventDefault();
                  }
                });
              }
              else
              {
                $.ajax({
                  url:'/project/item/mapping/update/'+mapping_setting_id,  
                  method:'put',  
                  dataType:'json',
                  data:{project_id:project_id,inbound_format:inbound_format,outbound_format:outbound_format,mapping_data:mapping_data},
                  success:function(response){
                    swal({
                      title: "success!",
                      text: "Mapping Setting Saved Successfully",
                      type: "success",
                      timer: 1200
                    });
                    inboundautocompletedata(JSON.parse(inbound_format));
                    console.log(inboundAutocompleteDataArray);
                    outboundautocompletedata(JSON.parse(outbound_format));
                    console.log(outboundAutocompleteDataArray);
                    inOutAutocompleteDataArray = inboundAutocompleteDataArray.concat(outboundAutocompleteDataArray);
                    numberedStepper.to(5);
                  },
                  error: function (textStatus, errorThrown) {
                    $('#collapseTwo').slideDown('slow');
                    $thisform.valid();
                    return false;
                  }
                });
              }
            }
            else
            {
              alert("not valid");
            }
          }
          else if(index == 4)
          {
            /* if($('input[name="duration_inbound_is_end_date"]:checked').val()=="no_end_date")
            {
              console.log("NO>>>"+$('#duration_inbound_end_date').val());
              $('#duration_inbound_end_date').addClass('hidden');
            }
            else
            {
              console.log('yes >>>>' + $('#duration_inbound_end_date').val());
              $('#duration_inbound_end_date').removeClass('hidden');
            } */

            //alert("index 4 call");
            inbound_start_date = $('#duration_inbound_start_date').val();
            outbound_start_date = $('#duration_outbound_start_date').val();
            var d = new Date();

            var month = d.getMonth()+1;
            var day = d.getDate();

            var output = d.getFullYear() + '-' +
              (month<10 ? '0' : '') + month + '-' +
            (day<10 ? '0' : '') + day;

            if($('#duration_inbound_start_date').val()=="")
            {
              $('#duration_inbound_start_date').val(output);
              document.getElementById("duration_inbound_start_date").setAttribute("min", output);
            }
            if($('#duration_outbound_start_date').val()=="")
            {
              $('#duration_inbound_start_date').val(output);
              document.getElementById("duration_outbound_start_date").setAttribute("min", output);
            }
            var d = new Date(inbound_start_date);
      
            var month = d.getMonth()+1;
            var day = d.getDate();

            var output = d.getFullYear() + '-' +
              (month<10 ? '0' : '') + month + '-' +
            (day<10 ? '0' : '') + day;
            $('#duration_inbound_end_date').val(output);
            document.getElementById("duration_inbound_end_date").setAttribute("min", output);

            var d = new Date(outbound_start_date);
  
            var month = d.getMonth()+1;
            var day = d.getDate();
    
            var output = d.getFullYear() + '-' +
              (month<10 ? '0' : '') + month + '-' +
            (day<10 ? '0' : '') + day;
            $('#duration_outbound_end_date').val(output);
            document.getElementById("duration_outbound_end_date").setAttribute("min", output);
            //document.getElementById("duration_inbound_start_date").setAttribute("min", output);
            
            if($('input[name="duration_inbound_is_end_date"]:checked').val()=="no_end_date")
            {
              $('#duration_inbound_end_date').addClass('hidden');
            }
            else
            {
              $('#duration_inbound_end_date').removeClass('hidden');
            }

            if($('input[name="duration_outbound_is_end_date"]:checked').val()=="no_end_date")
            {
              $('#duration_outbound_end_date').addClass('hidden');
            }
            else
            {
              $('#duration_outbound_end_date').removeClass('hidden');
            }
            // numberedStepper.next();
          } else {
            e.preventDefault();
          }
        } else {
          e.preventDefault();
        }
      });
    });

    $('#save_project').on('click',function(e){
      e.preventDefault();
      var isValid = $('#frm-save-project').valid();
      var project_id = $('#project_id').val();
      if (isValid) {
            project_detail.ProjectCode = $('#ProjectCode').val();
            project_detail.ProjectName = $('#ProjectName').val();
            project_detail.CompanyName = $('#CompanyName').val();
            if(project_id=="")
            {

              $.ajax({
                url:'/projects/save',  
                method:'post',  
                dataType:'json',
                data:{ProjectName:project_detail.ProjectName,ProjectCode:project_detail.ProjectCode,CompanyName:project_detail.CompanyName},
                success:function(response){
                  // sweetAlert("success", "Project Created Successfully", "success");
                    swal({
                      title: "success!",
                      text: "Project Created Successfully",
                      type: "success",
                      timer: 1200
                    });
                  //console.log(response);
                  $('#project_id').val(response.id);
                },
              
              })
            }
            else
            {
              $.ajax({
                url:'/projects/update/'+project_id,  
                method:'put',  
                dataType:'json',
                data:{ProjectName:project_detail.ProjectName,ProjectCode:project_detail.ProjectCode,CompanyName:project_detail.CompanyName},
                success:function(response){
                  // sweetAlert("success", "Project Setting Saved Successfully", "success");
                    swal({
                      title: "success!",
                      text: "Project Setting Saved Successfully",
                      type: "success",
                      timer: 1200
                    });
                  console.log(response);
                }
              });
            }
          }
    });

    $('#save_inbound').on('click',function(e){
      e.preventDefault();
      var isValid = $('#frm-save-inbound').valid();
      if(isValid)
      {
        var inbound_setting_id = $("#inbound_setting_id").val();
        var inbound_format = $('#inboundFormat').val();
        var sync_type = $('input[name="sync_type"]:checked').val();
        var ftp_server_link = $('#ftp_server_link').val();
        var port = $('#port').val();
        var login_name = $('#login_name').val();
        var password = $('#password').val();
        var project_id = $('#project_id').val();
        var folder = $('#folderpath').val();
        var backup_folder = $('#backup_folder').val();
        var is_password_encrypted = $('#is_password_encrypted').val();
        var is_active = $('#is_active_inbound').data('value');
        var api_ddep_api = $('#api_ddep_api').val()==undefined ? "":$('#api_ddep_api').val();
        var api_user_api = $('#api_user_api').val()==undefined ? "":$('#api_user_api').val();
        var api_type = $('input[name="api_type"]:checked').val();
        if(sync_type == 'API' && api_type == 'DDEP_API')
        {
          $('#inbound_shedule_setting_tab').hide();
          $('#outbound_shedule_setting_tab').hide();
          $('#inbound_ddep_api_selected').show();
        }
        if(sync_type == 'API' && api_type == 'User_API')
        {
          $('#inbound_shedule_setting_tab').show();
          $('#outbound_shedule_setting_tab').hide();
          $('#inbound_ddep_api_selected').hide();
        }
        if(inbound_setting_id=="")
        {

          $.ajax({
            url:'/inbound_setting/save',  
            method:'post',  
            dataType:'json',
            data:{project_id:project_id,inbound_format:inbound_format,sync_type:sync_type,ftp_server_link:ftp_server_link,port:port,login_name:login_name,password:password,is_password_encrypted:is_password_encrypted,folder:folder,backup_folder:backup_folder,api_ddep_api:api_ddep_api,api_user_api:api_user_api,api_type:api_type,is_active:is_active},
            success:function(response){
              console.log(response);
              //alert("Setting saved successfully");
              $("#inbound_setting_id").val(response.id);
            },
            error:function(textStatus,errorThrown){
              $('#collapseTwo').slideDown('slow');
              $('#frm-save-inbound').valid();
              return false;
            }
          });
        }
        else
        {
          $.ajax({
            url:'/inbound_setting/update/'+inbound_setting_id,  
            method:'put',  
            dataType:'json',
            data:{project_id:project_id,inbound_format:inbound_format,sync_type:sync_type,ftp_server_link:ftp_server_link,port:port,login_name:login_name,password:password,is_password_encrypted:is_password_encrypted,folder:folder,backup_folder:backup_folder,api_ddep_api:api_ddep_api,api_user_api:api_user_api,api_type:api_type,is_active:is_active},
            success:function(response){
              //console.log(response);
              // sweetAlert("success", "Inbound Setting Saved Successfully", "success");
                    swal({
                      title: "success!",
                      text: "Inbound Setting Saved Successfully",
                      type: "success",
                      timer: 1200
                    });
              //$("#inbound_setting_id").val(response.id);
            },
            error:function(textStatus,errorThrown){
             
                $('#collapseTwo').slideDown('slow');
                $('#frm-save-inbound').valid();
                return false;
              
            }
          });
        }
      }
    });

    $('#is_active_inbound').on('click',function(e){
      var is_active = $(this).data('value');
      e.preventDefault();
      var isValid = $('#frm-save-inbound').valid();
      var project_id = $('#project_id').val();
      var inbound_setting_id = $('#inbound_setting_id').val();
      if(isValid)
      {
        if(is_active=="Inactive")
        {
          is_active = "Active";
          $(this).attr('data-value',"Active");
          $(this).removeClass('btn-secondary');
          $(this).addClass('btn-success');
          $(this).html('Active');
        }
        else
        {
          is_active = "Inactive";
          $(this).attr('data-value',"Inactive");
          $(this).removeClass('btn-success');
          $(this).addClass('btn-secondary');
          $(this).html('Inactive')
        }
        var inbound_setting_id = $("#inbound_setting_id").val();
        var inbound_format = $('#inboundFormat').val();
        var sync_type = $('input[name="sync_type"]:checked').val();
        var ftp_server_link = $('#ftp_server_link').val();
        var port = $('#port').val();
        var login_name = $('#login_name').val();
        var password = $('#password').val();
        var project_id = $('#project_id').val();
        var folder = $('#folderpath').val();
        var backup_folder = $('#backup_folder').val();
        var is_password_encrypted = $('#is_password_encrypted').val();
        var is_active = $('#is_active_inbound').data('value');
        if(inbound_setting_id=="")
        {

          $.ajax({
            url:'/inbound_setting/save',  
            method:'post',  
            dataType:'json',
            data:{project_id:project_id,inbound_format:inbound_format,sync_type:sync_type,ftp_server_link:ftp_server_link,port:port,login_name:login_name,password:password,is_password_encrypted:is_password_encrypted,folder:folder,backup_folder:backup_folder,is_active:is_active},
            success:function(response){
              console.log(response);
              //alert("Setting saved successfully");
              $("#inbound_setting_id").val(response.id);
            },
            error:function(textStatus,errorThrown){
              $('#collapseTwo').slideDown('slow');
              $('#frm-save-inbound').valid();
              return false;
            }
          });
        }
        else
        {
          $.ajax({
            url:'/inbound_setting/update/'+inbound_setting_id,  
            method:'put',  
            dataType:'json',
            data:{project_id:project_id,inbound_format:inbound_format,sync_type:sync_type,ftp_server_link:ftp_server_link,port:port,login_name:login_name,password:password,is_password_encrypted:is_password_encrypted,folder:folder,backup_folder:backup_folder,is_active:is_active},
            success:function(response){
              //console.log(response);

              // sweetAlert("success", "Inbound Setting Saved Successfully", "success");
                    swal({
                      title: "success!",
                      text: "Inbound Setting Saved Successfully",
                      type: "success",
                      timer: 1200
                    });
              //$("#inbound_setting_id").val(response.id);
            },
            error:function(textStatus,errorThrown){
              $('#collapseTwo').slideDown('slow');
              $('#frm-save-inbound').valid();
              return false;
            }
          });
        }
      }
      else
      {
        is_active = "Inactive";
        $(this).attr('data-value',"Inactive");
        $(this).removeClass('btn-success');
        $(this).addClass('btn-secondary');
        $(this).html('Inactive');
      }
    });

    $('#is_active_outbound').on('click',function(e){
      e.preventDefault();
      var is_active = $(this).data('value');
      var isValid = $('#frm-save-outbound').valid();
      var project_id = $('#project_id').val();
      var outbound_setting_id = $('#outbound_setting_id').val();
      var is_active = $('#is_active_outbound').data('value');
      if(isValid)
      {
        if(is_active=="Inactive")
        {
          is_active = "Active";
          $(this).attr('data-value',"Active");
          $(this).removeClass('btn-secondary');
          $(this).addClass('btn-success');
          $(this).html('Active');
        }
        else
        {
          is_active = "Inactive";
          $(this).attr('data-value',"Inactive");
          $(this).removeClass('btn-success');
          $(this).addClass('btn-secondary');
          $(this).html('Inactive')
        }
        var sync_type_out =$('input[name="sync_type_out"]:checked').val();
        var api_url = $('#api_url').val();
        var outbound_format = $('#outbound_format').val();
        var outbound_setting_id = $('#outbound_setting_id').val();
        var project_id = $('#project_id').val();
        if(outbound_setting_id=="")
        {
          $.ajax({
            url:'/outbound_setting/save',  
            method:'post',  
            dataType:'json',
            data:{project_id:project_id,sync_type_out:sync_type_out,api_url:api_url,outbound_format:outbound_format,is_active:is_active},
            success:function(response){
              console.log(response);
              //alert("Setting saved successfully");
              $("#outbound_setting_id").val(response.id);
            },
            error:function(textStatus,errorThrown)
              { 
                console.log("error in outbound setting");
                $('#collapseFour').slideDown('slow');
                $('#frm-save-outbound').valid();
                return false;
              }
          });
        }
        else
        {
          $.ajax({
            url:'/outbound_setting/update/'+outbound_setting_id,  
            method:'put',  
            dataType:'json',
            data:{project_id:project_id,sync_type_out:sync_type_out,api_url:api_url,outbound_format:outbound_format,is_active:is_active},
            success:function(response){
              //console.log(response);
              //alert("Outbound Setting saved successfully");
              //$("#outbound_setting_id").val(response.id);
            },
            error:function(textStatus,errorThrown)
              { 
                console.log("error in outbound setting");
                $('#collapseFour').slideDown('slow');
                $('#frm-save-outbound').valid();
                return false;
              }
          });
        }
      }
      else
      {
        is_active = "Inactive";
        $(this).data('value',"Inactive");
        $(this).removeClass('btn-success');
        $(this).addClass('btn-secondary');
        $(this).html('Inactive');
      }
    });

    $('#save_outbound').on('click',function(e){
      e.preventDefault();
      var isValid = $('#frm-save-outbound').valid();
      var project_id = $('#project_id').val();
      var outbound_setting_id = $('#outbound_setting_id').val();
      var is_active = $('#is_active_outbound').data('value');
      if(isValid)
      {
        var sync_type_out =$('input[name="sync_type_out"]:checked').val();
        var api_url = $('#api_url').val();
        var outbound_format = $('#outbound_format').val();
        var outbound_setting_id = $('#outbound_setting_id').val();
        var project_id = $('#project_id').val();
        var is_active = $("#is_active_outbound").data('value');
        if(outbound_setting_id=="")
        {
          $.ajax({
            url:'/outbound_setting/save',  
            method:'post',  
            dataType:'json',
            data:{project_id:project_id,sync_type_out:sync_type_out,api_url:api_url,outbound_format:outbound_format,is_active:is_active},
            success:function(response){
              console.log(response);
              //alert("Setting saved successfully");
              $("#outbound_setting_id").val(response.id);
            },
            error:function(textStatus,errorThrown)
            { 
              console.log("error in outbound setting");
              $('#collapseFour').slideDown('slow');
              $('#frm-save-outbound').valid();
              return false;
            }
          });
        }
        else
        {
          $.ajax({
            url:'/outbound_setting/update/'+outbound_setting_id,  
            method:'put',  
            dataType:'json',
            data:{project_id:project_id,sync_type_out:sync_type_out,api_url:api_url,outbound_format:outbound_format,is_active:is_active},
            success:function(response){
              //console.log(response);
              // sweetAlert("success", "Outbound Setting Saved Successfully", "success");
                swal({
                  title: "success!",
                  text: "Outbound Setting Saved Successfully",
                  type: "success",
                  timer: 1200
                });
              //$("#outbound_setting_id").val(response.id);
            },
            error:function(textStatus,errorThrown)
              { 
                console.log("error in outbound setting");
                $('#collapseFour').slideDown('slow');
                $('#frm-save-outbound').valid();
                return false;
              }
          });
        }
      }
    });

    $('#save_mapping').on('click', function(e){
      e.preventDefault();
      var isValid = $('#frm-save-mapping').valid();
      if(isValid)
      {
        var project_id = $('#project_id').val();
        var mapping_setting_id = $("#mapping_setting_id").val();
        var inbound_format = $("#InboundFormatData").val();
        var outbound_format = $('#OutboundFormatData').val();
        var mapping_data = $('#mySavedModel2').val();
        if(mapping_setting_id=="")
        {
          $.ajax({
            url:'/project/item/mapping/save',  
            method:'post',  
            dataType:'json',
            data:{project_id:project_id,inbound_format:inbound_format,outbound_format:outbound_format,mapping_data:mapping_data},
            success:function(response){
              $("#mapping_setting_id").val(response.id);
              swal({
                title: "success!",
                text: "Mapping Setting Saved Successfully",
                type: "success",
                timer: 1200
              });
              inboundautocompletedata(JSON.parse(inbound_format));
              console.log(inboundAutocompleteDataArray);
              outboundautocompletedata(JSON.parse(outbound_format));
              console.log(outboundAutocompleteDataArray);
              inOutAutocompleteDataArray = inboundAutocompleteDataArray.concat(outboundAutocompleteDataArray);
            },
            error: function (textStatus, errorThrown) {
              $e.preventDefault();
            }
          });
        }
        else
        {
          $.ajax({
            url:'/project/item/mapping/update/'+mapping_setting_id,  
            method:'put',  
            dataType:'json',
            data:{project_id:project_id,inbound_format:inbound_format,outbound_format:outbound_format,mapping_data:mapping_data},
            success:function(response){
              swal({
                title: "success!",
                text: "Mapping Setting Saved Successfully",
                type: "success",
                timer: 1200
              });
              inboundautocompletedata(JSON.parse(inbound_format));
              console.log(inboundAutocompleteDataArray);
              outboundautocompletedata(JSON.parse(outbound_format));
              console.log(outboundAutocompleteDataArray);
              inOutAutocompleteDataArray = inboundAutocompleteDataArray.concat(outboundAutocompleteDataArray);
            },
            error: function (textStatus, errorThrown) {
              $('#collapseTwo').slideDown('slow');
              $thisform.valid();
              return false;
            }
          });
        }
      }
    });

    $('#is_active_mapping').on('click', function(e){
      e.preventDefault();
      var isValid = $('#frm-save-mapping').valid();
      if(isValid)
      {
        var project_id = $('#project_id').val();
        var mapping_setting_id = $("#mapping_setting_id").val();
        var inbound_format = $("#InboundFormatData").val();
        var outbound_format = $('#OutboundFormatData').val();
        var mapping_data = $('#mySavedModel2').val();
        var is_active = $('#is_active_mapping').data('value');
        if(is_active=="Inactive")
        {
          is_active = "Active";
        }
        else
        {
          is_active = "Inactive";
        }

        if(mapping_setting_id=="")
        {
          $.ajax({
            url:'/project/item/mapping/save',  
            method:'post',  
            dataType:'json',
            data:{project_id:project_id,inbound_format:inbound_format,outbound_format:outbound_format,mapping_data:mapping_data,is_active:is_active},
            success:function(response){
              $("#mapping_setting_id").val(response.id);
              if(is_active=="Inactive")
              {
                $('#is_active_mapping').attr('data-value',"Inactive");
                $('#is_active_mapping').removeClass('btn-success');
                $('#is_active_mapping').addClass('btn-secondary');
                $('#is_active_mapping').html('Inactive');
              }
              else
              {
                $('#is_active_mapping').attr('data-value',"Active");
                $('#is_active_mapping').removeClass('btn-secondary');
                $('#is_active_mapping').addClass('btn-success');
                $('#is_active_mapping').html('Active');
              }
              swal({
                title: "success!",
                text: "Mapping Setting Saved Successfully",
                type: "success",
                timer: 1200
              });
            },
            error: function (textStatus, errorThrown) {
              $e.preventDefault();
            }
          });
        }
        else
        {
          $.ajax({
            url:'/project/item/mapping/update/'+mapping_setting_id,  
            method:'put',  
            dataType:'json',
            data:{project_id:project_id,inbound_format:inbound_format,outbound_format:outbound_format,mapping_data:mapping_data,is_active:is_active},
            success:function(response){
              // sweetAlert("success", "Mapping Setting Saved Successfully", "success");
              if(is_active=="Inactive")
              {
                $('#is_active_mapping').attr('data-value',"Inactive");
                $('#is_active_mapping').removeClass('btn-success');
                $('#is_active_mapping').addClass('btn-secondary');
                $('#is_active_mapping').html('Inactive');
              }
              else
              {
                $('#is_active_mapping').attr('data-value',"Active");
                $('#is_active_mapping').removeClass('btn-secondary');
                $('#is_active_mapping').addClass('btn-success');
                $('#is_active_mapping').html('Active');
              }
              swal({
                title: "success!",
                text: "Mapping Setting Saved Successfully",
                type: "success",
                timer: 1200
              });
            },
            error: function (textStatus, errorThrown) {
              $('#collapseTwo').slideDown('slow');
              $thisform.valid();
              return false;
            }
          });
        }
      }
    });

    $('#outbound_validation_save').on('click',function(e){
      e.preventDefault();
      var isValid = $('#frm-save-outbound').valid();
      if(isValid) {
        var project_id = $('#project_id').val();
        var outbound_validation_id = $('#outbound_validation_id').val();
        var formdata = new FormData(document.getElementById("frm-save-outbound-validation"));
        var formDataObj = {};
        var formDataArr = [];
        var i = 1;
        formdata.forEach((value, key) => {
          if (key == 'validations[][logical]') {
            var newkey = 'logical';
          } else if (key == 'validations[][original]') {
            var newkey = 'original';
          } else if (key == 'validations[][operations]') {
            var newkey = 'operations';
          } else if (key == 'validations[][column]') {
            var newkey = 'column';
          }
          formDataObj[newkey] = value
          i++;
          if (i > 4) {
            formDataArr.push(formDataObj);
            i = 1;
            formDataObj = {};
          }
        });
        if (formDataArr.length <= 0) {
          formDataArr = '';
        }
        if(outbound_validation_id == "") {
          $.ajax({
            url: '/outbound_validation/save',  
            method: 'post',
            dataType: 'json',
            data: { project_id: project_id, validations: formDataArr },
            success:function(response) {
              $("#outbound_validation_id").val(response.id);
              swal({
                title: "success!",
                text: "Outbound Validation Saved Successfully",
                type: "success",
                timer: 1200
              });
              var modal = document.getElementById("outbound_validation_modal");
              modal.style.display = "none";
            },
            error:function(textStatus,errorThrown) {
              $('#collapseFour').slideDown('slow');
              $('#frm-save-outbound').valid();
              return false;
            }
          });
        } else {
          $.ajax({
            url: '/outbound_validation/update/' + outbound_validation_id,  
            method: 'put',  
            dataType: 'json',
            data: { project_id: project_id, validations: formDataArr },
            success:function(response) {
              swal({
                title: "success!",
                text: "Outbound Validation Saved Successfully",
                type: "success",
                timer: 1200
              });
            },
            error:function(textStatus,errorThrown) {
              $('#collapseFour').slideDown('slow');
              $('#frm-save-outbound').valid();
              return false;
            }
          });
        }
      }
    });

    $(horizontalWizard)
    .find('.btn-prev')
    .on('click', function () {
      numberedStepper.previous();
    });

    $(horizontalWizard)
    .find('.btn-submit')
    .on('click', function () {
      var isValid = $(this).parent().siblings('form').valid();
      if (isValid) {
        var schedule_setting_id = $('#schedule_setting_id').val();
        console.log("schedule_setting_id=="+schedule_setting_id);
        var project_id = $('#project_id').val();
        console.log($('input[name="s_configure"]:checked').val());
        
        var Schedule_configure_inbound = $('input[name="s_configure_inbound"]:checked').val();
        var schedule_type_inbound = $('input[name="schedule_type_inbound"]:checked').val();
        var one_time_occurrence_inbound_date="";
        var one_time_occurrence_inbound_time="";
        var one_time_occurrence_outbound_date="";
        var one_time_occurrence_outbound_time="";
        if(schedule_type_inbound=='OneTime')
        {
          one_time_occurrence_inbound_date = $('#one_time_occurrence_inbound_date').val();
          one_time_occurrence_inbound_time = $('#one_time_occurrence_inbound_time').val();
        }
        
        var day_frequency_inbound_count =$('#day_frequency_inbound_count').val();
        var day_frequency_outbound_count =$('#day_frequency_outbound_count').val();
        var weekly_frequency_inbound_count =$('#weekly_frequency_inbound_count').val();
        var weekly_frequency_outbound_count =$('#weekly_frequency_outbound_count').val();
        var monthly_frequency_day_inbound =$('#monthly_frequency_day_inbound').val();
        var monthly_frequency_day_inbound_count =$('#monthly_frequency_day_inbound_count').val();
        var monthly_frequency_day_outbound =$('#monthly_frequency_day_outbound').val();
        var monthly_frequency_day_outbound_count =$('#monthly_frequency_day_outbound_count').val();
        var monthly_frequency_the_inbound_count =$('#monthly_frequency_the_inbound_count').val();
        var monthly_frequency_the_outbound_count =$('#monthly_frequency_the_outbound_count').val();
        var daily_frequency_type_inbound=$('input[name=daily_frequency_type_inbound]:checked').val();
        var daily_frequency_type_outbound=$('input[name=daily_frequency_type_outbound]:checked').val();
        var daily_frequency_once_time_inbound=$('#daily_frequency_once_time_inbound').val();
        var daily_frequency_once_time_outbound=$('#daily_frequency_once_time_outbound').val();
        var daily_frequency_every_time_unit_inbound=$('#daily_frequency_every_time_unit_inbound').val();
        var daily_frequency_every_time_unit_outbound=$('#daily_frequency_every_time_unit_outbound').val();
        var daily_frequency_every_time_count_inbound=$('#daily_frequency_every_time_count_inbound').val();
        var daily_frequency_every_time_count_outbound=$('#daily_frequency_every_time_count_outbound').val();
        var daily_frequency_every_time_count_start_inbound=$('#daily_frequency_every_time_count_start_inbound').val();
        var daily_frequency_every_time_count_end_inbound=$('#daily_frequency_every_time_count_end_inbound').val();
        var daily_frequency_every_time_count_end_outbound=$('#daily_frequency_every_time_count_end_outbound').val();
        var daily_frequency_every_time_count_start_outbound=$('#daily_frequency_every_time_count_start_outbound').val();
        var monthly_field_setting_inbound = [];
        var monthly_field_setting_outbound = [];
        var occurs_weekly_fields_inbound = [];
        var occurs_weekly_fields_outbound = [];
        var duration_inbound_end_date = $('#duration_inbound_end_date').val();
        var duration_inbound_start_date = $('#duration_inbound_start_date').val();
        var duration_inbound_is_end_date = $('input[name="duration_inbound_is_end_date"]:checked').val();
        
        var duration_outbound_end_date = $('#duration_outbound_end_date').val();
        var duration_outbound_start_date = $('#duration_outbound_start_date').val();
        var duration_outbound_is_end_date = $('input[name="duration_outbound_is_end_date"]:checked').val();
        var occurs_inbound =$('#occurs_time_inbound').val();

        if(occurs_inbound=="daily")
        {

        }
        else if(occurs_inbound=="monthly")
        {
           var inbound_monthly_day=$('input[name=inbound_monthly_day]:checked').val();
           if(inbound_monthly_day=="day")
           {
             var temp_obj = {};
              //var per_day = $('#per_day').val();
              temp_obj['inbound_monthly_day'] = "day";
              //temp_obj['per_day'] = per_day;
              monthly_field_setting_inbound.push(temp_obj);
           }
           else
           {
              var temp_obj = {};
              var the_day_of = $('#the_day_of').val();
              var the_days = $('#the_days').val();
              temp_obj['inbound_monthly_day'] = "the";
              temp_obj['the_day_of'] = the_day_of;
              temp_obj['the_days'] = the_days;
              monthly_field_setting_inbound.push(temp_obj);
           }
        }
        else if(occurs_inbound=="weekly")
        {
            $('input[name = occurs_weekly_fields_inbound]:checked').each(function(){
              var tmp_week_obj = {}
              tmp_week_obj['day'] = $(this).val();
              occurs_weekly_fields_inbound.push(tmp_week_obj);
            });
        }
        //var recurs_count_inbound =$('#recurs_count_inbound').val();
        //var recurs_time_inbound =$('#recurs_time_inbound').val();
       
        var Schedule_configure_outbound = $('input[name="s_configure_outbound"]:checked').val();
        var schedule_type_outbound = $('input[name="schedule_type_outbound"]:checked').val();
        if(schedule_type_outbound=='OneTime')
        {
          one_time_occurrence_outbound_date = $('#one_time_occurrence_outbound_date').val();
          one_time_occurrence_outbound_time = $('#one_time_occurrence_outbound_time').val();
        }
        var occurs_outbound =$('#occurs_time_outbound').val();
      
        //var recurs_count_outbound =$('#recurs_count_outbound').val();
        //var recurs_time_outbound =$('#recurs_time_outbound').val();
        if(occurs_outbound=="daily")
        {
          
        }
        else if(occurs_outbound=="monthly")
        {
           var outbound_monthly_day=$('input[name=outbound_monthly_day]:checked').val();
           if(outbound_monthly_day=="day")
           {
             var temp_obj = {};
              //var per_day = $('#per_day_outbound').val();
              temp_obj['outbound_monthly_day'] = "day";
              //temp_obj['per_day'] = per_day;
              monthly_field_setting_outbound.push(temp_obj);
           }
           else
           {
              var temp_obj = {};
              var the_day_of_outbound = $('#the_day_of_outbound').val();
              var the_days_outbound = $('#the_days_outbound').val();
              temp_obj['outbound_monthly_day'] = "the";
              temp_obj['the_day_of'] = the_day_of_outbound;
              temp_obj['the_days'] = the_days_outbound;
              monthly_field_setting_outbound.push(temp_obj);
           }
        }
        else if(occurs_outbound=="weekly")
        {
          $('input[name = occurs_weekly_fields_outbound]:checked').each(function(){
            var tmp_week_obj = {}
            tmp_week_obj['day'] = $(this).val();
            occurs_weekly_fields_outbound.push(tmp_week_obj);
          });
        }
        var next_date_inbound_start = new Date($("#duration_inbound_start_date").val());
        var next_date_inbound_string = next_date_inbound_start.toUTCString();
        var next_date_inbound = parseInt(next_date_inbound_start.getTime()+(next_date_inbound_start.getTimezoneOffset()*60*1000));//new Date(next_date_inbound_string);
        var next_date_outbound_start = new Date($("#duration_outbound_start_date").val());
        var next_date_outbound_string = next_date_outbound_start.toUTCString();
        var next_date_outbound = parseInt(next_date_outbound_start.getTime()+(next_date_outbound_start.getTimezoneOffset()*60*1000));
        if(daily_frequency_type_inbound=="Occurs Once At")
        {
          var inbound_time = daily_frequency_once_time_inbound;
          var inbound_parts = inbound_time.split(":");
          var result_inbound = milliseconds(inbound_parts[0],inbound_parts[1], 0);
          next_date_inbound = parseInt(next_date_inbound+result_inbound);
        }
        else
        {
          var inbound_time=daily_frequency_every_time_count_start_inbound
          var inbound_parts = inbound_time.split(":");
          var result_inbound = milliseconds(inbound_parts[0], inbound_parts[1], 0);
          next_date_inbound = parseInt(next_date_inbound+result_inbound);
        }

        if(daily_frequency_type_outbound=="Occurs Once At")
        {
          var outbound_time = daily_frequency_once_time_outbound;
          var outbound_parts = outbound_time.split(":");
          var result_outbound = milliseconds(outbound_parts[0], outbound_parts[1], 0);
          next_date_outbound = parseInt(next_date_outbound+result_outbound);
        }
        else
        {
          var outbound_time=daily_frequency_every_time_count_start_outbound
          var outbound_parts = outbound_time.split(":");
          var result_outbound = milliseconds(outbound_parts[0], outbound_parts[1], 0);
          next_date_outbound = parseInt(next_date_outbound+result_outbound);
        }
        //var next_date_outbound = new Date(next_date_outbound_string);
        //next_date_inbound.setUTCHours(0,0,0,0);
        
        //next_date_outbound.setUTCHours(0,0,0,0);
       
        console.log("next inbound >> "+next_date_inbound);
        console.log("next outbound >> "+next_date_outbound);
        if(schedule_setting_id=="")
        {
          $.ajax({
            url:'/schedule_setting/save',  
            method:'post',  
            dataType:'json',
            data:{project_id:project_id,
              Schedule_configure_inbound:Schedule_configure_inbound,
              schedule_type_inbound:schedule_type_inbound,
              one_time_occurrence_inbound_date:one_time_occurrence_inbound_date,
              one_time_occurrence_inbound_time:one_time_occurrence_inbound_time,
              occurs_inbound:occurs_inbound,
              monthly_field_setting_inbound:monthly_field_setting_inbound,
              occurs_weekly_fields_inbound:occurs_weekly_fields_inbound,
              day_frequency_inbound_count:day_frequency_inbound_count,
              day_frequency_outbound_count:day_frequency_outbound_count,
              weekly_frequency_inbound_count:weekly_frequency_inbound_count,
              weekly_frequency_outbound_count:weekly_frequency_outbound_count,
              monthly_frequency_day_inbound:monthly_frequency_day_inbound,
              monthly_frequency_day_inbound_count:monthly_frequency_day_inbound_count,
              monthly_frequency_day_outbound:monthly_frequency_day_outbound,
              monthly_frequency_day_outbound_count:monthly_frequency_day_outbound_count,
              monthly_frequency_the_inbound_count:monthly_frequency_the_inbound_count,
              monthly_frequency_the_outbound_count:monthly_frequency_the_outbound_count,
              daily_frequency_type_inbound:daily_frequency_type_inbound,
              daily_frequency_type_outbound:daily_frequency_type_outbound,
              daily_frequency_once_time_inbound:daily_frequency_once_time_inbound,
              daily_frequency_once_time_outbound:daily_frequency_once_time_outbound,
              daily_frequency_every_time_unit_inbound:daily_frequency_every_time_unit_inbound,
              daily_frequency_every_time_unit_outbound:daily_frequency_every_time_unit_outbound,
              daily_frequency_every_time_count_inbound:daily_frequency_every_time_count_inbound,
              daily_frequency_every_time_count_outbound:daily_frequency_every_time_count_outbound,
              daily_frequency_every_time_count_start_inbound:daily_frequency_every_time_count_start_inbound,
              daily_frequency_every_time_count_end_inbound:daily_frequency_every_time_count_end_inbound,
              daily_frequency_every_time_count_end_outbound:daily_frequency_every_time_count_end_outbound,
              daily_frequency_every_time_count_start_outbound:daily_frequency_every_time_count_start_outbound,
              //recurs_count_inbound:recurs_count_inbound,
              //recurs_time_inbound:recurs_time_inbound,
              Schedule_configure_outbound:Schedule_configure_outbound,
              schedule_type_outbound:schedule_type_outbound,
              one_time_occurrence_outbound_date:one_time_occurrence_outbound_date,
              one_time_occurrence_outbound_time:one_time_occurrence_outbound_time,
              occurs_outbound:occurs_outbound,
              monthly_field_setting_outbound:monthly_field_setting_outbound,
              occurs_weekly_fields_outbound:occurs_weekly_fields_outbound,
              //recurs_count_outbound:recurs_count_outbound,
              //recurs_time_outbound:recurs_time_outbound,
              duration_inbound_start_date:duration_inbound_start_date,
              duration_inbound_is_end_date:duration_inbound_is_end_date,
              duration_inbound_end_date:duration_inbound_end_date,
              duration_outbound_start_date:duration_outbound_start_date,
              duration_outbound_is_end_date:duration_outbound_is_end_date,
              duration_outbound_end_date:duration_outbound_end_date,
              next_date_inbound:next_date_inbound,
              next_date_outbound:next_date_outbound
            },
            success:function(response){
              console.log(response);
              sweetAlert("success", "Setting Saved Successfully", "success");
              $("#schedule_setting_id").val(response.id);
              window.location.href = "/projects/project-list";
            },
            error:function(textStatus,errorThrown)
            {
              return false;
            }
          });
        }
        else
        {
          $.ajax({
            url:'/schedule_setting/update/'+schedule_setting_id,  
            method:'put',  
            dataType:'json',
            data:{project_id:project_id,
              Schedule_configure_inbound:Schedule_configure_inbound,
              schedule_type_inbound:schedule_type_inbound,
              one_time_occurrence_inbound_date:one_time_occurrence_inbound_date,
              one_time_occurrence_inbound_time:one_time_occurrence_inbound_time,
              occurs_inbound:occurs_inbound,
              monthly_field_setting_inbound:monthly_field_setting_inbound,
              occurs_weekly_fields_inbound:occurs_weekly_fields_inbound,
              day_frequency_inbound_count:day_frequency_inbound_count,
              day_frequency_outbound_count:day_frequency_outbound_count,
              weekly_frequency_inbound_count:weekly_frequency_inbound_count,
              weekly_frequency_outbound_count:weekly_frequency_outbound_count,
              monthly_frequency_day_inbound:monthly_frequency_day_inbound,
              monthly_frequency_day_inbound_count:monthly_frequency_day_inbound_count,
              monthly_frequency_day_outbound:monthly_frequency_day_outbound,
              monthly_frequency_day_outbound_count:monthly_frequency_day_outbound_count,
              monthly_frequency_the_inbound_count:monthly_frequency_the_inbound_count,
              monthly_frequency_the_outbound_count:monthly_frequency_the_outbound_count,
              daily_frequency_type_inbound:daily_frequency_type_inbound,
              daily_frequency_type_outbound:daily_frequency_type_outbound,
              daily_frequency_once_time_inbound:daily_frequency_once_time_inbound,
              daily_frequency_once_time_outbound:daily_frequency_once_time_outbound,
              daily_frequency_every_time_unit_inbound:daily_frequency_every_time_unit_inbound,
              daily_frequency_every_time_unit_outbound:daily_frequency_every_time_unit_outbound,
              daily_frequency_every_time_count_inbound:daily_frequency_every_time_count_inbound,
              daily_frequency_every_time_count_outbound:daily_frequency_every_time_count_outbound,
              daily_frequency_every_time_count_start_inbound:daily_frequency_every_time_count_start_inbound,
              daily_frequency_every_time_count_end_inbound:daily_frequency_every_time_count_end_inbound,
              daily_frequency_every_time_count_end_outbound:daily_frequency_every_time_count_end_outbound,
              daily_frequency_every_time_count_start_outbound:daily_frequency_every_time_count_start_outbound,
              //recurs_count_inbound:recurs_count_inbound,
              //recurs_time_inbound:recurs_time_inbound,
              Schedule_configure_outbound:Schedule_configure_outbound,
              schedule_type_outbound:schedule_type_outbound,
              one_time_occurrence_outbound_date:one_time_occurrence_outbound_date,
              one_time_occurrence_outbound_time:one_time_occurrence_outbound_time,
              occurs_outbound:occurs_outbound,
              monthly_field_setting_outbound:monthly_field_setting_outbound,
              occurs_weekly_fields_outbound:occurs_weekly_fields_outbound,
              //recurs_count_outbound:recurs_count_outbound,
              //recurs_time_outbound:recurs_time_outbound,
              duration_inbound_start_date:duration_inbound_start_date,
              duration_inbound_is_end_date:duration_inbound_is_end_date,
              duration_inbound_end_date:duration_inbound_end_date,
              duration_outbound_start_date:duration_outbound_start_date,
              duration_outbound_is_end_date:duration_outbound_is_end_date,
              duration_outbound_end_date:duration_outbound_end_date,
              next_date_inbound:next_date_inbound,
              next_date_outbound:next_date_outbound
            },
            success:function(response){
              //console.log(response);
              sweetAlert("success", "Schedule Setting Saved Successfully", "success");
              window.location.href = "/projects/project-list";
              //$("#schedule_setting_id").val(response.id);
            },
            error:function(textStatus,errorThrown)
            {
              return false;
            }
          });
        }
      }
    });
      
    $('input[name=s_configure_inbound]').on('change',function(){
      if($(this).val()=='click_by_user')
      {
        $('div.relation-schedule-open').slideUp('slow');
      }
      else
      {
        $('div.relation-schedule-open').slideDown('slow');
      }
    });

    $('input[name=s_configure_outbound]').on('change',function(){
      if($(this).val()=='click_by_user')
      {
        $('div.relation-outbound-schedule-open').slideUp('slow');
      }
      else
      {
        $('div.relation-outbound-schedule-open').slideDown('slow');
      }
    });

    $('#occurs_time_inbound').on('change',function(){
      if($(this).val()=='daily')
      {
        $('#weekly_fields').slideUp('slow');
        $('#monthly_fields').slideUp('slow');
        $('#selectOccursMonthIn').hide();
        $('#selectOccursWeekIn').hide();
        $('#selectOccursDayIn').show();
      }
      if($(this).val()=='weekly')
      {
        $('#monthly_fields').slideUp('slow');
        $('#weekly_fields').slideDown('slow');
        $('#selectOccursMonthIn').hide();
        $('#selectOccursWeekIn').show();
        $('#selectOccursDayIn').hide();
      }
      if($(this).val()=='monthly')
      {
        $('#weekly_fields').slideUp('slow');
        $('#monthly_fields').slideDown('slow');
        $('#selectOccursMonthIn').show();
        $('#selectOccursWeekIn').hide();
        $('#selectOccursDayIn').hide();
      }
    });

    $('#occurs_time_outbound').on('change',function(){
      if($(this).val()=='daily')
      {
        $('#weekly_fields_outbound').slideUp('slow');
        $('#monthly_fields_outbound').slideUp('slow');
        $('#selectOccursMonthInOutbound').hide();
        $('#selectOccursWeekInOutbound').hide();
        $('#selectOccursDayInOutbound').show();
      }
      if($(this).val()=='weekly')
      {
        $('#monthly_fields_outbound').slideUp('slow');
        $('#weekly_fields_outbound').slideDown('slow');
        $('#selectOccursMonthInOutbound').hide();
        $('#selectOccursWeekInOutbound').show();
        $('#selectOccursDayInOutbound').hide();
      }
      if($(this).val()=='monthly')
      {
        $('#weekly_fields_outbound').slideUp('slow');
        $('#monthly_fields_outbound').slideDown('slow');
        $('#selectOccursMonthInOutbound').show();
        $('#selectOccursWeekInOutbound').hide();
        $('#selectOccursDayInOutbound').hide();
      }
    });

    $('#the_section').hide();
    $('#the_section_outbound').hide();
    $('input[name=inbound_monthly_day]').on('change',function(){
      if($(this).val()=='day')
      {
        $('#the_section').slideUp('slow');
        $('#day_txt_box').slideDown('slow');
      }
      if($(this).val()=='The')
      {
        $('#day_txt_box').slideUp('slow');
        $('#the_section').slideDown('slow');
      }
    });

    $('input[name=outbound_monthly_day]').on('change',function(){
      if($(this).val()=='day')
      {
        $('#the_section_outbound').slideUp('slow');
        $('#day_txt_box_outbound').slideDown('slow');
      }
      if($(this).val()=='The')
      {
        $('#day_txt_box_outbound').slideUp('slow');
        $('#the_section_outbound').slideDown('slow');
      }
    });

    $('input[name="duration_inbound_is_end_date"]').on('change',function(){
      console.log($(this).val());
      if($(this).val()=='yes_end_date')
      {
        $('#duration_inbound_end_date').removeClass('hidden');
        //var start_date = 
        var d = new Date(inbound_start_date);
        
        var month = d.getMonth()+1;
        var day = d.getDate();

        var output = d.getFullYear() + '-' +
          (month<10 ? '0' : '') + month + '-' +
        (day<10 ? '0' : '') + day;
        $('#duration_inbound_end_date').val(output);
        document.getElementById("duration_inbound_end_date").setAttribute("min", output);
        //$('#duration_inbound_end_date').val
      }
      else
      {
        $('#duration_inbound_end_date').addClass('hidden');
      }
    });

    $('input[name="duration_outbound_is_end_date"]').on('change',function(){
      console.log($(this).val());
      if($(this).val()=='yes_end_date')
      {
        $('#duration_outbound_end_date').removeClass('hidden');
        var d = new Date(outbound_start_date);
        
        var month = d.getMonth()+1;
        var day = d.getDate();

        var output = d.getFullYear() + '-' +
          (month<10 ? '0' : '') + month + '-' +
        (day<10 ? '0' : '') + day;
        $('#duration_outbound_end_date').val(output);
        document.getElementById("duration_outbound_end_date").setAttribute("min", output);
      }
      else
      {
        $('#duration_outbound_end_date').addClass('hidden');
      }
    });

    $('input[name="daily_frequency_type_inbound"]').on('change',function(){
      console.log($(this).val());
      if($(this).val()=='Occurs Once At')
      {
        $("#recursEveryDiv").hide();
        $("#startingEndingDiv").hide();
        $("#daily_frequency_once_time_inbound").show();
        //$('#duration_outbound_end_date').removeClass('hidden');
      }
      else
      {
        $("#daily_frequency_once_time_inbound").hide();
        $("#recursEveryDiv").show();
        $("#startingEndingDiv").show();
        //$('#duration_outbound_end_date').addClass('hidden');
      }
    });
  
    $('#duration_inbound_start_date').on('change',function(){
      //alert("change");
      //alert(inbound_start_date);
      if($('#duration_inbound_start_date').val()=="")
      {
        var d = new Date();

        var month = d.getMonth()+1;
        var day = d.getDate();

        var output = d.getFullYear() + '-' +
          (month<10 ? '0' : '') + month + '-' +
        (day<10 ? '0' : '') + day;
        $('#duration_inbound_start_date').val(output);
        document.getElementById("duration_inbound_start_date").setAttribute("min", output);
      }
      else
      {
        document.getElementById("duration_inbound_start_date").setAttribute("min", inbound_start_date);
      }
      var d = new Date(inbound_start_date);
          
      var month = d.getMonth()+1;
      var day = d.getDate();

      var output = d.getFullYear() + '-' +
        (month<10 ? '0' : '') + month + '-' +
      (day<10 ? '0' : '') + day;
      $('#duration_inbound_end_date').val(output);
      document.getElementById("duration_inbound_end_date").setAttribute("min", output);
    });

    $('#duration_outbound_start_date').on('change',function(){
      //alert("outbound change found")
      if($('#duration_outbound_start_date').val()=="")
      {
        var d = new Date();

        var month = d.getMonth()+1;
        var day = d.getDate();

        var output = d.getFullYear() + '-' +
          (month<10 ? '0' : '') + month + '-' +
        (day<10 ? '0' : '') + day;
        $('#duration_outbound_start_date').val(output);
        document.getElementById("duration_outbound_start_date").setAttribute("min", output);
      }
      else
      {
        document.getElementById("duration_outbound_start_date").setAttribute("min", outbound_start_date);
      }
      var d = new Date(outbound_start_date);
          
      var month = d.getMonth()+1;
      var day = d.getDate();

      var output = d.getFullYear() + '-' +
        (month<10 ? '0' : '') + month + '-' +
      (day<10 ? '0' : '') + day;
      $('#duration_outbound_end_date').val(output);
      document.getElementById("duration_outbound_end_date").setAttribute("min", output);
    });
    //outbound div

    $('input[name="daily_frequency_type_outbound"]').on('change',function(){
      console.log($(this).val());
       if($(this).val()=='Occurs Once At')
       {
          $("#recursEveryDivOutbound").hide();
          $("#startingEndingDivOutbound").hide();
          $("#daily_frequency_once_time_outbound").show();
         //$('#duration_outbound_end_date').removeClass('hidden');
       }
       else
       {
         $("#daily_frequency_once_time_outbound").hide();
          $("#recursEveryDivOutbound").show();
          $("#startingEndingDivOutbound").show();
         //$('#duration_outbound_end_date').addClass('hidden');
       }
    });

    $('input[name=schedule_type_inbound]').on('change',function(){
      if($(this).val()=='Recurring')
      {
        $('#inbound-data-one-time').hide();
        $('#inbound-data-recurring').show();
      }
      else
      {
        $('#inbound-data-one-time').show();
        $('#inbound-data-recurring').hide();
      }
      
      //alert("ram");
    });

    $('input[name=schedule_type_outbound]').on('change',function(){
      if($(this).val()=='Recurring')
      {
        $('#outbound-data-one-time').hide();
        $('#outbound-data-recurring').show();
      }
      else
      {
        $('#outbound-data-one-time').show();
        $('#outbound-data-recurring').hide();
      }
      //alert("ram");
    });
  }

  $('#conntest').on('click',function(){
    var host=$('#ftp_server_link').val();
    var user=$('#login_name').val();
    var password=$('#password').val();
    var port=$('#port').val();
    var folderpath=$('#folderpath').val();
    var isValid = $('#frm-save-inbound').valid();
    if(isValid)
    {

      $.blockUI({
        message: '<div class="spinner-border text-primary" role="status"></div>',
        //timeout: 1000,
        css: {
          backgroundColor: 'transparent',
          border: '0'
        },
        overlayCSS: {
          backgroundColor: '#fff',
          opacity: 0.8
        }
      });
      $.ajax({
          url:'/inbound/testFtp/',
          method:'post',  
          dataType:'json',
          data:{host:host,user:user,password:password,port:port,folderpath:folderpath},
          success:function(response){
            //console.log(response);
            if(response.Status==1)
            {
                //alert(response.Msg);
                $('#conn-alert').html(response.Msg);
                $('#conn-alert').removeClass('text-success');
                $('#conn-alert').removeClass('text-danger');
                $('#conn-alert').addClass('text-success');
                $('#conn-alert').show();
                $.unblockUI();

              /* sweetAlert("success", "connection", "success"); */
            }
            else
            {
              //alert(response.Msg);
              $('#conn-alert').html(response.Msg);
                $('#conn-alert').removeClass('text-success');
                $('#conn-alert').removeClass('text-danger');
                $('#conn-alert').addClass('text-danger');
                $('#conn-alert').show();
              $.unblockUI();
            }
            //$("#outbound_setting_id").val(response.id);
          }
        });
    }
  });

  // Vertical Wizard
  // --------------------------------------------------------------------
  if (typeof verticalWizard !== undefined && verticalWizard !== null) {
    var verticalStepper = new Stepper(verticalWizard, {
      linear: false
    });
    $(verticalWizard)
      .find('.btn-next')
      .on('click', function () {
        verticalStepper.next();
      });
    $(verticalWizard)
      .find('.btn-prev')
      .on('click', function () {
        verticalStepper.previous();
      });

    $(verticalWizard)
      .find('.btn-submit')
      .on('click', function () {
        sweetAlert("success", "Schedule Setting Saved Successfully", "success");
      });
  }

  // Modern Wizard
  // --------------------------------------------------------------------
  if (typeof modernWizard !== undefined && modernWizard !== null) {
    var modernStepper = new Stepper(modernWizard, {
      linear: false
    });
    $(modernWizard)
      .find('.btn-next')
      .on('click', function () {
        modernStepper.next();
      });
    $(modernWizard)
      .find('.btn-prev')
      .on('click', function () {
        modernStepper.previous();
      });

    $(modernWizard)
      .find('.btn-submit')
      .on('click', function () {
        sweetAlert("success", "Schedule Setting Saved Successfully", "success");
      });
  }

  // Modern Vertical Wizard
  // --------------------------------------------------------------------
  if (typeof modernVerticalWizard !== undefined && modernVerticalWizard !== null) {
    var modernVerticalStepper = new Stepper(modernVerticalWizard, {
      linear: false
    });
    $(modernVerticalWizard)
      .find('.btn-next')
      .on('click', function () {
        modernVerticalStepper.next();
      });
    $(modernVerticalWizard)
      .find('.btn-prev')
      .on('click', function () {
        modernVerticalStepper.previous();
      });

    $(modernVerticalWizard)
      .find('.btn-submit')
      .on('click', function () {
        alert('Submitted..!!');
      });
  }

  $('body').on('change', 'input:radio[name=sync_type]', function() {
    $('.sync_confige_tabs').hide();
    $('#api_options').hide();
    $('#api_ddep_api_input_method').hide();
    $('#api_ddep_api_input_parameter').hide();
    if (this.value == 'FTP' || this.value == 'SFTP') {
      $('#ftpInDiv').show();
    }
    if (this.value == 'API') {
      $('#apiInUrlDiv').show();
      $('#api_options').show();
    }
  });

  $('body').on('change', 'input:radio[name=api_type]', function() {
    if (this.value == 'User_API') {
      $('#api_user_api_input').show();
      $('#api_ddep_api_input').hide();
    }
    if (this.value == 'DDEP_API') {
      $('#api_ddep_api_input').show();
      $('#api_user_api_input').hide();
    }
  });

  var eproject_id = $('#project_id').val();
  if (eproject_id != '') {
    $('.step-trigger').removeAttr('disabled');
    $('body').on('click', '.bs-stepper-header .step', function(){
      var dataID = $(this).attr('data-target');
      var stepper = new Stepper(document.querySelector('.bs-stepper'));
      if (dataID == '#create-project') {
        stepper.to(1);
      } else if (dataID == '#Inbound') {
        stepper.to(2);
      } else if (dataID == '#outbound-step') {
        stepper.to(3);
      } else if (dataID == '#mapping-step') {
        stepper.to(4);
      } else if (dataID == '#schedule-step') {
        stepper.to(5);
      }
      $('.step-trigger').removeAttr('disabled');
    });
    var project_id = $('#project_id').val();
    editalltabs(project_id);
  }

  var modal = document.getElementById("outbound_validation_modal");
  var btn = document.getElementById("outbound_validation_popup_btn");
  var mclose = document.getElementById("outbound-validation-modal-close");
  btn.onclick = function() {
    modal.style.display = "flex";
  }
  mclose.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  $("body").on("click", "#addvalidationrow", function () {
    var newRow = "<tr>";
    var cols = "";
    cols += '<td class="col-sm-2 logical-select"><select class="select-dropdown form-control form-control-lg" name="validations[][logical]"><option value="AND">AND</option><option value="OR">OR</option></select></td>';
    cols += '<td class="col-sm-3 autocomplete"><input type="text" name="validations[][original]" class="form-control border-0 autocompletevalidation" id="original_'+validationRowCounter+'"/></td>';
    cols += '<td class="col-sm-3 operations-select"><select class="select-dropdown form-control form-control-lg" name="validations[][operations]"><option value="==">=</option><option value=">">></option><option value=">=">>=</option><option value="<"><</option><option value="<="><=</option><option value="<>"><></option><option value="Contains">Contains</option></select></td>';
    cols += '<td class="col-sm-2 autocomplete"><input type="text" name="validations[][column]" class="form-control border-0 autocompletevalidation" id="column_'+validationRowCounter+'"/></td>';
    cols += '<td class="col-sm-2"><a href="javascript:void(0);" type="button" class="ibtnDel"> Delete </a></td>';
    newRow += cols;
    newRow += "</tr>";
    $("table.order-list tbody").append(newRow);
    validationRowCounter++;
  });

  $("body table.order-list").on("click", ".ibtnDel", function (event) {
    $(this).closest("tr").remove();
    validationRowCounter -= 1;
  });

  $("body").on("click", "#InboundDataBind, #OutboundDataBind", function () {
    var inbound_format = $("#InboundFormatData").val();
    var outbound_format = $("#OutboundFormatData").val();
    if (inbound_format != '') {
      inboundautocompletedata(JSON.parse(inbound_format));
      console.log(inboundAutocompleteDataArray);
    }
    if (outbound_format != '') {
      outboundautocompletedata(JSON.parse(outbound_format));
      console.log(outboundAutocompleteDataArray);
    }
    inOutAutocompleteDataArray = inboundAutocompleteDataArray.concat(outboundAutocompleteDataArray);
  });

  // Only inbound autocomplete data - inboundAutocompleteDataArray
  // Only outbound autocomplete data - outboundAutocompleteDataArray
  // Both inbound and outbound autocomplete data - inOutAutocompleteDataArray
  $("body").on("keypress", ".autocompleteformula", function() {
    var id = $(this).attr('id');
    autocomplete(document.getElementById(id), inboundAutocompleteDataArray);
  });

  var onlyInboundI = 0;
  var onlyInboundN = 0;
  $("body").on("keypress", ".autocompletevalidation", function(e) {
    if (e.keyCode == 8) {
      onlyInboundI = 0; onlyInboundN = 0;
    }
    if ((onlyInboundI == 1 && e.keyCode != 105 && e.keyCode != 73) || (onlyInboundN == 1 && e.keyCode != 110 && e.keyCode != 78)) {
      $('.inbounderror').show();
      return false;
    }
    if (onlyInboundI == 1 && (e.keyCode == 105 || e.keyCode == 73)) {
      onlyInboundI = 0;
      onlyInboundN = 1;
    }
    if (onlyInboundN == 1 && (e.keyCode == 110 || e.keyCode == 78)) {
      onlyInboundI = 0;
      onlyInboundN = 0;
      $('.inbounderror').hide();
    }
    if (e.keyCode == 64 && onlyInboundI == 0) {
      onlyInboundI = 1;
    }
    var id = $(this).attr('id');
    autocomplete(document.getElementById(id), inboundAutocompleteDataArray);
  });

  function editalltabs(project_id) {
    $.ajax({
      url:'/inbound_setting/editAPI/'+project_id,
      method:'get',
      dataType:'json',
      data:{},
      success:function(response,textStatus,xhr){
        if(xhr.status==200)
        {
          $("#inbound_setting_id").val(response._id);
          $('#inboundFormat').val(response.inbound_format);
          if (response.inbound_format == 'json') {
            $('#inboundFormat > option:eq(0)').attr('selected', true);
            $('#select2-inboundFormat-container').attr("title", "JSON");
            $('#select2-inboundFormat-container').html("JSON");
          } else {
            $('#inboundFormat > option:eq(1)').attr('selected', true);
            $('#select2-inboundFormat-container').attr("title", "XML");
            $('#select2-inboundFormat-container').html("XML");
          }
          $('#ftp_server_link').val(response.ftp_server_link);
          //$('#host').val(response.host);
          if (response.ftp_port == '' || response.ftp_port == undefined) {
            $('#port').val(response.port);
          } else {
            $('#port').val(response.ftp_port);
          }
          if (response.ftp_login_name == '' || response.ftp_login_name == undefined) {
            $('#login_name').val(response.login_name);
          } else {
            $('#login_name').val(response.ftp_login_name);
          }
          if (response.ftp_password == '' || response.ftp_password == undefined) {
            $('#password').val(response.password);
          } else {
            $('#password').val(response.ftp_password);
          }
          $('input[value="'+response.sync_type+'"]').prop('checked',true);
          if (response.sync_type == 'API' || response.sync_type == '' || response.sync_type == undefined) {
            $('#apiInUrlDiv').show();
            $('#api_options').show();
            var api_type = response.api_type;
            $('input[value="'+response.api_type+'"]').prop('checked',true);
            if(api_type == "User_API")
            {
              $('#api_ddep_api_input').hide();
              $('#api_user_api_input').show();
              $('#api_user_api').val(response.api_user_api);
              $('#inbound_shedule_setting_tab').show();
              $('#outbound_shedule_setting_tab').hide();
              $('#inbound_ddep_api_selected').hide();
            }
            if(api_type == "DDEP_API")
            {
              $('#api_user_api_input').hide();
              $('#api_ddep_api_input').show();
              $('#api_ddep_api').val(response.api_ddep_api);
              $('#inbound_shedule_setting_tab').hide();
              $('#outbound_shedule_setting_tab').hide();
              $('#inbound_ddep_api_selected').show();
            }
          }
          else if (response.sync_type == 'FTP' || response.sync_type == 'SFTP') {
            $('#ftpInDiv').show();
            $('#apiInUrlDiv').hide();
            $('#api_options').hide();
            $('#api_user_api_input').hide();
            $('#api_ddep_api_input').hide();
            $('#api_ddep_api_input_method').hide();
            $('#api_ddep_api_input_parameter').hide();
          }
          else
          {
            $('#apiInUrlDiv').hide();
            $('#api_options').hide();
            $('#api_user_api_input').hide();
            $('#api_ddep_api_input').hide();
            $('#api_ddep_api_input_method').hide();
            $('#api_ddep_api_input_parameter').hide();
          }
          if (response.ftp_folder == '' || response.ftp_folder == undefined) {
            $('#folderpath').val(response.folder);
          } else {
            $('#folderpath').val(response.ftp_folder);
          }
          if (response.ftp_backup_folder == '' || response.ftp_backup_folder == undefined) {
            $('#backup_folder').val(response.backup_folder);
          } else {
            $('#backup_folder').val(response.ftp_backup_folder);
          }
          $('#is_password_encrypted option[value="'+response.is_password_encrypted+'"]').prop('selected',true);
          $('#is_password_encrypted').trigger('change');

          //Thomas I changed Active evenet.
          if(response.is_active=="Active")
          {
            $('#is_active_inbound').removeClass('btn-secondary');
            $('#is_active_inbound').addClass('btn-success');
            $('#is_active_inbound').attr('data-value','Active');
            $('#is_active_inbound').html('Active');
          }
          else
          {
            $('#is_active_inbound').removeClass('btn-success');      //removeClass
            $('#is_active_inbound').addClass('btn-secondary');
            $('#is_active_inbound').attr('data-value','Active');       //Inactive
            $('#is_active_inbound').html('Active');               //Inactive
          }
        }
      }
    });
    $.ajax({
      url:'/outbound_setting/editAPI/'+project_id,
      method:'get',
      dataType:'json',
      data:{},
      success:function(response,textStatus,xhr){
        if(xhr.status==200)
        {
           $('input[name="sync_type_out"]:checked').val(response.sync_type_out);
            $('#api_url').val(response.api_url);
           $('#outbound_format').val(response.outbound_format);
            if (response.outbound_format == 'json') {
              $('#inboundFormat > option:eq(0)').attr('selected', true);
              $('#select2-inboundFormat-container').attr("title", "JSON");
              $('#select2-inboundFormat-container').html("JSON");
            }
           $('#outbound_setting_id').val(response._id);
           // $('#project_id').val(response.item_id);
           if(response.is_active=="Active")
          {
            $('#is_active_outbound').removeClass('btn-secondary');
            $('#is_active_outbound').addClass('btn-success');
            $('#is_active_outbound').attr('data-value','Active');
            $('#is_active_outbound').html('Active');
          }
          else
          {
            $('#is_active_outbound').removeClass('btn-success');
            $('#is_active_outbound').addClass('btn-secondary');
            $('#is_active_outbound').attr('data-value','Inactive');
            $('#is_active_outbound').html('Inactive');
          }
        }
      }
    });
    $.ajax({
      url:'/schedule_setting/editAPI/'+project_id,
      method:'get',
      dataType:'json',
      data:{},
      success:function(response,textStatus,xhr){
        if(xhr.status==200)
        {
            $('input[name="s_configure_inbound"][value="'+response.Schedule_configure_inbound+'"]').prop('checked',true);
            if(response.Schedule_configure_inbound=='click_by_user')
            {
                $('div.relation-schedule-open').hide();
            }
            else
            {
              $('div.relation-schedule-open').show();
            }

            if(response.Schedule_configure_outbound=='click_by_user')
            {
                $('div.relation-outbound-schedule-open').hide();
            }
            else
            {
              $('div.relation-outbound-schedule-open').show();
            }
            $('input[name="schedule_type_inbound"][value="'+response.schedule_type_inbound+'"]').prop('checked',true);
            if(response.schedule_type_inbound=='OneTime')
            {
              $('#inbound-data-recurring').hide();
              $('#inbound-data-one-time').show();
              $('#one_time_occurrence_inbound_date').val(response.one_time_occurrence_inbound_date);
              $('#one_time_occurrence_inbound_time').val(response.one_time_occurrence_inbound_time);
            }
            else
            {
              $('#inbound-data-recurring').show();
              $('#inbound-data-one-time').hide();
            }
            if(response.schedule_type_outbound=='OneTime')
            {
              $('#outbound-data-recurring').hide();
              $('#outbound-data-one-time').show();
              $('#one_time_occurrence_outbound_date').val(response.one_time_occurrence_outbound_date);
              $('#one_time_occurrence_outbound_time').val(response.one_time_occurrence_outbound_time);
            }
            else
            {
              $('#outbound-data-recurring').show();
              $('#outbound-data-one-time').hide();
            }
            $('#occurs_time_inbound').val(response.occurs_inbound).change();
            //$('#recurs_count_inbound').val(response.recurs_count_inbound);
            //$('#recurs_time_inbound').val(response.recurs_time_inbound);
            //$('#schedule_setting_id').val(response._id);
           $('input[name="s_configure_outbound"][value="'+response.Schedule_configure_outbound+'"]').prop('checked',true);
           $('input[name="schedule_type_outbound"][value="'+response.schedule_type_outbound+'"]').prop('checked',true);
           $('#day_frequency_inbound_count').val(response.day_frequency_inbound_count);
           $('#day_frequency_outbound_count').val(response.day_frequency_outbound_count);
           $('#weekly_frequency_inbound_count').val(response.weekly_frequency_inbound_count);
           $('#weekly_frequency_outbound_count').val(response.weekly_frequency_outbound_count);
           $('#weekly_frequency_inbound_count').val(response.weekly_frequency_inbound_count);
           $('#weekly_frequency_outbound_count').val(response.weekly_frequency_outbound_count);
           $('#monthly_frequency_day_inbound').val(response.monthly_frequency_day_inbound);
           $('#monthly_frequency_day_outbound').val(response.monthly_frequency_day_outbound);
           $('#monthly_frequency_day_inbound_count').val(response.monthly_frequency_day_inbound_count);
           $('#monthly_frequency_day_outbound_count').val(response.monthly_frequency_day_outbound_count);
           $('#monthly_frequency_the_inbound_count').val(response.monthly_frequency_the_inbound_count);
           $('#monthly_frequency_the_outbound_count').val(response.monthly_frequency_the_outbound_count);
           $('input[name="daily_frequency_type_inbound"][value="'+response.daily_frequency_type_inbound+'"]').prop('checked',true);
           $('input[name="daily_frequency_type_outbound"][value="'+response.daily_frequency_type_outbound+'"]').prop('checked',true);
           //$('#daily_frequency_type_inbound').val(response.daily_frequency_type_inbound);
           //$('#daily_frequency_type_outbound').val(response.daily_frequency_type_outbound);
           $('#daily_frequency_once_time_inbound').val(response.daily_frequency_once_time_inbound);
           $('#daily_frequency_once_time_outbound').val(response.daily_frequency_once_time_outbound);
           if($('input[name="daily_frequency_type_inbound"]:checked').val()=='Occurs every')
           {
              $("#daily_frequency_once_time_inbound").hide();
              $("#recursEveryDiv").show();
              $("#startingEndingDiv").show();
              $('#daily_frequency_every_time_unit_inbound').val(response.daily_frequency_every_time_unit_inbound).change();
              $('#daily_frequency_every_time_count_inbound').val(response.daily_frequency_every_time_count_inbound);
              $('#daily_frequency_every_time_count_start_inbound').val(response.daily_frequency_every_time_count_start_inbound);
              $('#daily_frequency_every_time_count_end_inbound').val(response.daily_frequency_every_time_count_end_inbound);
            }
           if($('input[name="daily_frequency_type_outbound"]:checked').val()=='Occurs every')
           {
              $("#daily_frequency_once_time_outbound").hide();
              $("#recursEveryDivOutbound").show();
              $("#startingEndingDivOutbound").show();
              $('#daily_frequency_every_time_unit_outbound').val(response.daily_frequency_every_time_unit_outbound).change();
              $('#daily_frequency_every_time_count_outbound').val(response.daily_frequency_every_time_count_outbound);
              $('#daily_frequency_every_time_count_start_outbound').val(response.daily_frequency_every_time_count_start_outbound);
              $('#daily_frequency_every_time_count_end_outbound').val(response.daily_frequency_every_time_count_end_outbound);
            }
           
           //$('#occurs_time_inbound option[value="'+response.occurs_time_inbound+'"]').attr("selected","selected");
           $("#occurs_time_inbound").val(response.occurs_inbound);
           $("#occurs_time_inbound").select2().trigger("change");
           $("#occurs_time_outbound").val(response.occurs_outbound)
           $("#occurs_time_outbound").select2().trigger("change");
           
           //$('#occurs_time_inbound').val(response.occurs_outbound);
           //$('#recurs_count_outbound').val(response.recurs_count_outbound);
           //$('#recurs_time_outbound').val(response.recurs_time_outbound);
           $("#schedule_setting_id").val(response._id);
           if(response.duration_inbound_start_date!=undefined)
           {
              $('#duration_inbound_start_date').val(response.duration_inbound_start_date);
           }
           if(response.duration_inbound_is_end_date!=undefined)
           {
            $('input[name="duration_inbound_is_end_date"][value="'+response.duration_inbound_is_end_date+'"]').prop('checked',true); 
           }
           if(response.duration_inbound_end_date!=undefined)
           {
              $('#duration_inbound_end_date').val(response.duration_inbound_end_date);
           }
           if(response.duration_outbound_start_date!=undefined)
           {
            $('#duration_outbound_start_date').val(response.duration_outbound_start_date);
           }
           if(response.duration_outbound_is_end_date!=undefined)
           {
            $('input[name="duration_outbound_is_end_date"][value="'+response.duration_outbound_is_end_date+'"]').prop('checked',true);
           }
           if(response.duration_outbound_end_date!=undefined)
           {
            $('#duration_outbound_end_date').val(response.duration_outbound_end_date);
           }
           if(response.occurs_inbound=="weekly")
           {
             $(response.occurs_weekly_fields_inbound).each(function(index,item){
              $('input[name="occurs_weekly_fields_inbound"][value="'+item.day+'"]').prop('checked',true);
            });

           }
           if(response.occurs_outbound=="weekly")
           {

              $(response.occurs_weekly_fields_outbound).each(function(index,item){
                $('input[name = occurs_weekly_fields_outbound][value="'+item.day+'"]').prop('checked',true);
              });
           }
           if(response.occurs_inbound=="monthly")
           {
              $(response.monthly_field_setting_inbound).each(function(index,item){
                if(item.inbound_monthly_day=="the")
                {
                  $('input[name=inbound_monthly_day][value="The"]').prop('checked',true).trigger('change');
                  $('#day_txt_box_inbound').hide();
                  $('#the_section_inbound').show();
                  $('#the_day_of').val(item.the_day_of).change();
                  //$('#the_day_of').val(item.the_day_of).change();
                  //$('#the_days').val(item.the_days).change();
                  $('#the_days').val(item.the_days).change();
                  //$('input[name=inbound_monthly_day]:checked').prop('checked',false);
                }
                else
                {
                  $('#the_section_inbound').hide();
                  $('#day_txt_box_inbound').show();
                }
                //$('input[name = occurs_weekly_fields_outbound][value="'+item.day+'"]').prop('checked',true);
              });
           }
           if(response.occurs_outbound=="monthly")
           {
              $(response.monthly_field_setting_outbound).each(function(index,item){
                if(item.outbound_monthly_day=="the")
                {
                  $('input[name=outbound_monthly_day][value="The"]').prop('checked',true).trigger('change');
                  $('#day_txt_box_outbound').hide();
                  $('#the_section_outbound').show();
                  $('#the_day_of_outbound').val(item.the_day_of).change();
                  //$('#the_day_of').val(item.the_day_of).change();
                  //$('#the_days').val(item.the_days).change();
                  $('#the_days_outbound').val(item.the_days).change();
                  //$('input[name=inbound_monthly_day]:checked').prop('checked',false);
                }
                else
                {
                  $('#the_section_outbound').hide();
                  $('#day_txt_box_outbound').show();
                }
                //$('input[name = occurs_weekly_fields_outbound][value="'+item.day+'"]').prop('checked',true);
              });
           }
        }
      }
    });
    $.ajax({
      url:'/project/item/mapping/editAPI/'+project_id,
      method:'get',
      dataType:'json',
      data:{},
      success:function(response,textStatus,xhr){
        if(xhr.status==200)
        {
          $("#mapping_setting_id").val(response._id);
          $('#InboundFormatData').val(response.inbound_format);
          $('#OutboundFormatData').val(response.outbound_format);
          $('#mySavedModel').val(response.mapping_data);
          if(response.is_active == "Active")
          {
            $('#is_active_mapping').removeClass('btn-secondary');
            $('#is_active_mapping').addClass('btn-success');
            $('#is_active_mapping').attr('data-value','Active');
            $('#is_active_mapping').html('Active');
          }
          else
          {
            $('#is_active_mapping').removeClass('btn-success');
            $('#is_active_mapping').addClass('btn-secondary');
            $('#is_active_mapping').attr('data-value','Inactive');
            $('#is_active_mapping').html('Inactive');
          }


          var mapping_data = JSON.parse(response.mapping_data);

          nodeDataArray = mapping_data.nodeDataArray;
          linkDataArray = mapping_data.linkDataArray;

          //Init GOJS UI
          myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

          inboundautocompletedata(JSON.parse(response.inbound_format));
          outboundautocompletedata(JSON.parse(response.outbound_format));
          inOutAutocompleteDataArray = inboundAutocompleteDataArray.concat(outboundAutocompleteDataArray);
        }
      }
    });
    $.ajax({
      url:'/outbound_validation/editAPI/'+project_id,
      method:'get',
      dataType:'json',
      data:{},
      success:function(response,textStatus,xhr) {
        if(xhr.status==200)
        {
          var validations = response.Data.validations;
          $('#outbound_validation_id').val(response.id);
          if (validations != '' && validations.length > 0) {
            var htmldata = '';
            for (var i = 0; i < validations.length; i++) {
              var newRow = "<tr>";
              var cols = "";
              cols += '<td class="col-sm-2 logical-select"><select class="select-dropdown form-control form-control-lg" name="validations[][logical]">';
              cols += '<option value="AND"';
              if (validations[i].logical == 'AND') {
                cols += ' selected';
              }
              cols += '>AND</option>';
              cols += '<option value="OR"';
              if (validations[i].logical == 'OR') {
                cols += ' selected';
              }
              cols += '>OR</option>';
              cols += '</select></td>';
              cols += '<td class="col-sm-3 autocomplete"><input type="text" name="validations[][original]" class="form-control border-0 autocompletevalidation" id="original_'+i+'" value="'+validations[i].original+'"/></td>';
              cols += '<td class="col-sm-3 operations-select"><select class="select-dropdown form-control form-control-lg" name="validations[][operations]">';
              cols += '<option value="=="';
              if (validations[i].operations == '==') {
                cols += ' selected';
              }
              cols += '>=</option>';
              cols += '<option value=">"';
              if (validations[i].operations == '>') {
                cols += ' selected';
              }
              cols += '>></option>';
              cols += '<option value=">="';
              if (validations[i].operations == '>=') {
                cols += ' selected';
              }
              cols += '>>=</option>';
              cols += '<option value="<"';
              if (validations[i].operations == '<') {
                cols += ' selected';
              }
              cols += '><</option>';
              cols += '<option value="<="';
              if (validations[i].operations == '<=') {
                cols += ' selected';
              }
              cols += '><=</option>';
              cols += '<option value="<>"';
              if (validations[i].operations == '<>') {
                cols += ' selected';
              }
              cols += '><></option>';
              /*cols += '<option value="NOT IN"';
              if (validations[i].operations == 'NOT IN') {
                cols += ' selected';
              }
              cols += '>NOT IN</option>';
              cols += '<option value="IN"';
              if (validations[i].operations == 'IN') {
                cols += ' selected';
              }
              cols += '>IN</option>';*/
              cols += '<option value="Contains"';
              if (validations[i].operations == 'Contains') {
                cols += ' selected';
              }
              cols += '>Contains</option>';
              cols += '</select></td>';
              cols += '<td class="col-sm-2 autocomplete"><input type="text" name="validations[][column]" class="form-control border-0 autocompletevalidation" id="column_'+i+'" value="'+validations[i].column+'"/></td>';
              cols += '<td class="col-sm-2"><a href="javascript:void(0);" type="button" class="ibtnDel"> Delete </a></td>';
              newRow += cols;
              newRow += "</tr>";
              htmldata += newRow;
            }
            validationRowCounter = i;
            $("table.order-list tbody").html(htmldata);
          }
        }
      }
    });
  }

  function inboundautocompletedata(reqBody) {
    inboundAutocompleteDataArray = [];
    Object.entries(reqBody).forEach((entry) => {
      const [key, value] = entry;

      var isArray = false;
      var newKey = '@In{'+key+'}';
      var normalKey = key;
      if (key >= 0) {} else {
        var key_count = checkInboundAutocompleteKey(newKey, inboundAutocompleteDataArray);
      }

      if (key_count > 1) {
        newKey = '@In{'+key+key_count+'}';
        normalKey = normalKey+key_count;
      }

      if (key >= 0) {} else {
        inboundAutocompleteDataArray.push(newKey);
      }
      if (!Array.isArray(value) && value != null && typeof(value) != "object") {
      }

      if (!Array.isArray(value) && value != null && typeof(value) == "object") {
        var newtest = inboundautocompletedata1(normalKey, value, isArray);
      }
      if (Array.isArray(value) && value != null && typeof(value) == "object") {
        var newtest = inboundautocompletedata1(normalKey, value, true);
      }
    });
    return inboundAutocompleteDataArray;
  }

  function inboundautocompletedata1(normalKey, reqBody, isArray) {
    var retrun = '';
    var parentKeya = normalKey;
    Object.entries(reqBody).forEach((entry) => {
      const [key, value] = entry;

      var normalKey = parentKeya;
      if (key >= 0) {
        var newKey = '@In{'+normalKey+'}';
        normalKey = normalKey;
      } else {
        var newKey = '@In{'+normalKey+'.'+key+'}';
        normalKey = normalKey+'.'+key;
      }
      if (key >= 0) {} else {
        var key_count = checkInboundAutocompleteKey(newKey, inboundAutocompleteDataArray);
      }

      if (key_count > 1 && !isArray) {
        newKey = '@In{'+normalKey+key_count+'}';
        normalKey = normalKey+key_count;
      }

      if (key >= 0) {} else {
        if (key_count > 1 && isArray) {} else {
          inboundAutocompleteDataArray.push(newKey);
        }
      }
      if (!Array.isArray(value) && value != null && typeof(value) != "object") {
      }

      if (!Array.isArray(value) && value != null && typeof(value) == "object") {
        var newtest = inboundautocompletedata2(normalKey, value, isArray);
      }
      if (Array.isArray(value) && value != null && typeof(value) == "object") {
        var newtest = inboundautocompletedata2(normalKey, value, true);
      }
    });
    return retrun;
  }

  function inboundautocompletedata2(normalKey, reqBody, isArray) {
    var retrun = '';
    var parentKeya = normalKey;
    Object.entries(reqBody).forEach((entry) => {
      const [key, value] = entry;

      var normalKey = parentKeya;
      if (key >= 0) {
        var newKey = '@In{'+normalKey+'}';
        normalKey = normalKey;
      } else {
        var newKey = '@In{'+normalKey+'.'+key+'}';
        normalKey = normalKey+'.'+key;
      }
      if (key >= 0) {} else {
        var key_count = checkInboundAutocompleteKey(newKey, inboundAutocompleteDataArray);
      }

      if (key_count > 1 && !isArray) {
        newKey = '@In{'+normalKey+key_count+'}';
        normalKey = normalKey+key_count;
      }

      if (key >= 0) {} else {
        if (key_count > 1 && isArray) {} else {
          inboundAutocompleteDataArray.push(newKey);
        }
      }
      if (!Array.isArray(value) && value != null && typeof(value) != "object") {
      }

      if (!Array.isArray(value) && value != null && typeof(value) == "object") {
        var newtest = inboundautocompletedata1(normalKey, value, isArray);
      }
      if (Array.isArray(value) && value != null && typeof(value) == "object") {
        var newtest = inboundautocompletedata1(normalKey, value, true);
      }
    });
    return retrun;
  }

  function outboundautocompletedata(reqBody) {
    outboundAutocompleteDataArray = [];
    Object.entries(reqBody).forEach((entry) => {
      const [key, value] = entry;

      var isArray = false;
      var newKey = '@Out{'+key+'}';
      var normalKey = key;
      if (key >= 0) {} else {
        var key_count = checkInboundAutocompleteKey(newKey, outboundAutocompleteDataArray);
      }

      if (key_count > 1) {
        newKey = '@Out{'+key+key_count+'}';
        normalKey = normalKey+key_count;
      }

      if (key >= 0) {} else {
        outboundAutocompleteDataArray.push(newKey);
      }

      if (!Array.isArray(value) && value != null && typeof(value) == "object") {
        var newtest = outboundautocompletedata1(normalKey, value, isArray);
      }
      if (Array.isArray(value) && value != null && typeof(value) == "object") {
        var newtest = outboundautocompletedata1(normalKey, value, true);
      }
    });
    return outboundautocompletedata;
  }

  function outboundautocompletedata1(normalKey, reqBody, isArray) {
    var retrun = '';
    var parentKeya = normalKey;
    Object.entries(reqBody).forEach((entry) => {
      const [key, value] = entry;

      var normalKey = parentKeya;
      if (key >= 0) {
        var newKey = '@Out{'+normalKey+'}';
        normalKey = normalKey;
      } else {
        var newKey = '@Out{'+normalKey+'.'+key+'}';
        normalKey = normalKey+'.'+key;
      }
      if (key >= 0) {} else {
        var key_count = checkInboundAutocompleteKey(newKey, outboundAutocompleteDataArray);
      }

      if (key_count > 1 && !isArray) {
        newKey = '@Out{'+normalKey+key_count+'}';
        normalKey = normalKey+key_count;
      }

      if (key >= 0) {} else {
        if (key_count > 1 && isArray) {} else {
          outboundAutocompleteDataArray.push(newKey);
        }
      }

      if (!Array.isArray(value) && value != null && typeof(value) == "object") {
        var newtest = outboundautocompletedata2(normalKey, value, isArray);
      }
      if (Array.isArray(value) && value != null && typeof(value) == "object") {
        var newtest = outboundautocompletedata2(normalKey, value, true);
      }
    });
    return retrun;
  }

  function outboundautocompletedata2(normalKey, reqBody, isArray) {
    var retrun = '';
    var parentKeya = normalKey;
    Object.entries(reqBody).forEach((entry) => {
      const [key, value] = entry;

      var normalKey = parentKeya;
      if (key >= 0) {
        var newKey = '@Out{'+normalKey+'}';
        normalKey = normalKey;
      } else {
        var newKey = '@Out{'+normalKey+'.'+key+'}';
        normalKey = normalKey+'.'+key;
      }
      if (key >= 0) {} else {
        var key_count = checkInboundAutocompleteKey(newKey, outboundAutocompleteDataArray);
      }

      if (key_count > 1 && !isArray) {
        newKey = '@Out{'+normalKey+key_count+'}';
        normalKey = normalKey+key_count;
      }

      if (key >= 0) {} else {
        if (key_count > 1 && isArray) {} else {
          outboundAutocompleteDataArray.push(newKey);
        }
      }

      if (!Array.isArray(value) && value != null && typeof(value) == "object") {
        var newtest = outboundautocompletedata1(normalKey, value, isArray);
      }
      if (Array.isArray(value) && value != null && typeof(value) == "object") {
        var newtest = outboundautocompletedata1(normalKey, value, true);
      }
    });
    return retrun;
  }

  function checkInboundAutocompleteKey(key, dataArray) {
    var j = 1;
    for (var i = 0; i < dataArray.length; i++) {
      var key1 = (j == 1) ? key : key + j;
      if (dataArray[i] == key1) {
        j++;
      }
    }
    return j;
  }

  function autocomplete(inp, arr) {
    var currentFocus;
    var newValue = 0;
    var fullValue = '';
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    /*execute a function when someone writes in the text field:*/
    /*inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      // close any already open lists of autocompleted values
      closeAllLists();
      if (!val) { return false; }
      currentFocus = -1;
      // create a DIV element that will contain the items (values):
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      // append the DIV element as a child of the autocomplete container:
      this.parentNode.appendChild(a);
      // for each item in the array...
      for (i = 0; i < arr.length; i++) {
        // check if the item starts with the same letters as the text field value:
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          // create a DIV element for each matching element:
          b = document.createElement("DIV");
          // make the matching letters bold:
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          // insert a input field that will hold the current array item's value:
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          // execute a function when someone clicks on the item value (DIV element):
          b.addEventListener("click", function(e) {
            // insert the value for the autocomplete text field:
            inp.value = this.getElementsByTagName("input")[0].value;
            // close the list of autocompleted values,
            // (or any other open lists of autocompleted values:
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    });*/
    inp.addEventListener("keyup", function(e) {
      console.log('e.keyCode => '+e.keyCode);
      if ((e.keyCode == 8 || e.keyCode >= 48 && e.keyCode <= 90 ) || ( e.keyCode >= 96 && e.keyCode <= 105 ) || ( e.keyCode >= 186 && e.keyCode <= 222 )) {
        if (e.keyCode == 8) {
          onlyInboundI = 0; onlyInboundN = 0;
        }
        var a, b, i, val = inp.value;
        // var fullValue = inp.value;
        console.log('val 1 3 => '+val);
        console.log('e.key => '+e.key);
        console.log('newValue => '+newValue);
        if (newValue == 0 && e.key == '@') {
          val = e.key;
          newValue = 1;
        }
        console.log('newValue 123 => '+newValue);
        console.log('val 1 => '+val);
        if (val.includes('@')) {
          var pieces = val.split("@");
          console.log(pieces);
          console.log('pieces.length => '+pieces.length);
          if (pieces[pieces.length-1] != undefined) {
            val = '@'+pieces[pieces.length-1];
          } else {
            val = '@';
          }
        }
        console.log('val => '+val);
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              var values = '';
              if (pieces != undefined) {
                console.log(pieces);
                for (var j = 0; j < pieces.length-1; j++) {
                  console.log('pieces => '+pieces[j]);
                  if (pieces[j] != '') {
                    if (pieces[j].startsWith("In{")) {
                      values += '@'+pieces[j];
                    } else {
                      values += pieces[j];
                    }
                  }
                }
              }
              inp.value = values+this.getElementsByTagName("input")[0].value;
              fullValue = inp.value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              newValue = 0;
              console.log('newValue 1 => '+newValue);
              closeAllLists();
            });
            a.appendChild(b);
          }
        }
      } else {
        if (e.keyCode == 46) {
          newValue = 0;
        }
      }
    });

    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
    });

    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }

    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }
});