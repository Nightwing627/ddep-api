/*=========================================================================================
    File Name: wizard-steps.js
    Description: wizard steps page specific js
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

$(function () {
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
    var project_detail ={};
          var inbound_server_detail = {};
          var outbound_detail = {};
          var schedule_detail ={};
          $('#weekly_fields').hide();
          $('#weekly_fields_outbound').hide();
          $('#monthly_fields').hide();  
          $('#monthly_fields_outbound').hide();  
          
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
        // can't seem to turn off when I press the first item. ¯\_(ツ)_/¯

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
            maxlength: 20,
            regex: /^(\/)[a-zA-Z0-9-_\/]+$/,
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
          }
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
            if(index==0)
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
                    numberedStepper.next();
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
                    sweetAlert("success", "Project Setting Saved Successfully", "success");
                    //console.log(response);
                    numberedStepper.next();
                  },
                  error:function(textStatus,error)
                  {
                    return false;
                  }
                });
              }
              if(project_id!="")
              {
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
                        $('#inboundFormat > option:eq(1)').attr('selected', true);
                      } else {
                        $('#inboundFormat > option:eq(0)').attr('selected', true);
                      }
                      $('#select2-inboundFormat-container').attr("title", response.inbound_format);
                      $('#select2-inboundFormat-container').html(response.inbound_format);
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
                        }
                        if(api_type == "DDEP_API")
                        {
                          $('#api_user_api_input').hide();
                          $('#api_ddep_api_input').show();
                          $('#api_ddep_api').val(response.api_ddep_api);
                        }
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
                      if (response.sync_type == 'FTP' || response.sync_type == 'SFTP') {
                        $('#ftpInDiv').show();
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
                      console.log(response.is_active);
                      if(response.is_active=="Active")
                      {
                        $('#is_active_inbound').addClass('btn-success');
                        $('#is_active_inbound').data('value','Active');
                        $('#is_active_inbound').html('Active');
                      }
                      else
                      {
                        $('#is_active_inbound').removeClass('btn-success');
                        $('#is_active_inbound').data('value','Inactive');
                        $('#is_active_inbound').html('Inactive');
                      }
                    }
                    //console.log(response);
                    //console.log(response._id);
                    //if(response.status)
                    
                  }
                })
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
                       $('#outbound_setting_id').val(response._id);
                       $('#project_id').val(response.project_id);
                       if(response.is_active=="Active")
                      {
                        $('#is_active_outbound').addClass('btn-success');
                        $('#is_active_outbound').data('value','Active');
                        $('#is_active_outbound').html('Active');
                      }
                      else
                      {
                        $('#is_active_outbound').removeClass('btn-success');
                        $('#is_active_outbound').data('value','Inactive');
                        $('#is_active_outbound').html('Inactive');
                      }
                    }
                    //console.log(response);
                    //console.log(response._id);
                    //if(response.status)
                    
                  }
                })
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
                        console.log("schedule id found = "+response._id);
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
                       console.log("inbound"+response.occurs_inbound);
                       console.log("outbound"+response.occurs_outbound);
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
                           //console.log(item.day);
                          $('input[name="occurs_weekly_fields_inbound"][value="'+item.day+'"]').prop('checked',true);
                        });

                       }
                       if(response.occurs_outbound=="weekly")
                       {

                          $(response.occurs_weekly_fields_outbound).each(function(index,item){
                            //console.log(item);
                            $('input[name = occurs_weekly_fields_outbound][value="'+item.day+'"]').prop('checked',true);
                          });
                       }
                       if(response.occurs_inbound=="monthly")
                       {
                          $(response.monthly_field_setting_inbound).each(function(index,item){
                            console.log("monthly setting==="+item.inbound_monthly_day)
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
                            console.log("monthly setting==="+item.outbound_monthly_day)
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
                    //console.log(response);
                    //console.log(response._id);
                    //if(response.status)
                    
                  }
                })
              }
              //console.log(project_detail);
            }
            else if(index==1)
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
                }
                if(sync_type=="API" && api_type == 'User_API')
                {
                  $('#inbound_shedule_setting_tab').show();
                  $('#outbound_shedule_setting_tab').hide();
                }
                if(sync_type=="FTP")
                {
                  $('#inbound_shedule_setting_tab').show();
                  $('#outbound_shedule_setting_tab').show();
                }
                if(inbound_setting_id=="")
                {
                  $.ajax({
                    url:'/inbound_setting/save',  
                    method:'post',  
                    dataType:'json',
                    data:{project_id:project_id,inbound_format:inbound_format,sync_type:sync_type,ftp_server_link:ftp_server_link,port:port,login_name:login_name,password:password,is_password_encrypted:is_password_encrypted,folder:folder,backup_folder:backup_folder,api_ddep_api:api_ddep_api,api_user_api:api_user_api,api_type:api_type,is_active:is_active,api_ddep_api_receive_parameter_name:api_ddep_api_receive_parameter_name},
                    success:function(response){
                      console.log(response);
                      $("#inbound_setting_id").val(response.id);
                      numberedStepper.next();
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
                      sweetAlert("success", "Inbound Setting Saved Successfully", "success");
                      numberedStepper.next();
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
                      numberedStepper.next();
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
                      $("#outbound_setting_id").val(outbound_setting_id);
                      numberedStepper.next();
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
              numberedStepper.next();
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
                    sweetAlert("success", "Project Created Successfully", "success");
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
                    sweetAlert("success", "Project Setting Saved Successfully", "success");
                    console.log(response);
                  }
                });
              }
            }
      })
      $('#save_inbound').on('click',function(e){
        e.preventDefault();
        var isValid = $('#frm-save-inbound').valid();
         var project_id = $('#project_id').val();
         var inbound_setting_id = $('#inbound_setting_id').val();
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
          if(api_type == 'DDEP_API')
          {
            $('#inbound_shedule_setting_tab').hide();
            $('#outbound_shedule_setting_tab').hide();
          }
          if(api_type == 'User_API')
          {
            $('#inbound_shedule_setting_tab').show();
            $('#outbound_shedule_setting_tab').hide();
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
                sweetAlert("success", "Inbound Setting Saved Successfully", "success");
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
      })
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
              $(this).data('value',"Active");
              $(this).removeClass('btn-secondary');
              $(this).addClass('btn-success');
              $(this).html('Active');
            }
            else
            {
              is_active = "Inactive";
              $(this).data('value',"Inactive");
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

                sweetAlert("success", "Inbound Setting Saved Successfully", "success");
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
            $(this).data('value',"Inactive");
            $(this).removeClass('btn-success');
            $(this).addClass('btn-secondary');
            $(this).html('Inactive');
         }
      })
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
              $(this).data('value',"Active");
              $(this).removeClass('btn-secondary');
              $(this).addClass('btn-success');
              $(this).html('Active');
            }
            else
            {
              is_active = "Inactive";
              $(this).data('value',"Inactive");
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
      })
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
                    sweetAlert("success", "Outbound Setting Saved Successfully", "success");
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
      })
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
                //window.location.href = "/projects/project-list";
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
    })
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
    })
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
  $('#')
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
  
});

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