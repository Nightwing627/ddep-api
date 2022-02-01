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
                  ProjectCode: function() { return $("#ProjectCode").val();
                },
                project_id: function() { return $("#project_id").val();
              },
                
              
              },
            }
          },
          ProjectName: {
            required: true
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
          /* api_url: {
            required: true
          }, */
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
          
        },
        messages : {
          ProjectCode : {
              required : "Project Code Is Required",
              remote : "Project Code already exists."
          }
      }

      });
    });

    $(horizontalWizard)
      .find('.btn-next')
      .each(function (index) {
        $(this).on('click', function (e) {
          var isValid = $(this).parent().siblings('form').valid();
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
                      $('#ftp_server_link').val(response.ftp_server_link);
                      //$('#host').val(response.host);
                      $('#port').val(response.port);
                      $('#login_name').val(response.login_name);
                      $('#password').val(response.password);
                      $('input[value="'+response.sync_type+'"]').prop('checked',true);
                      $('#folderpath').val(response.folder);
                      $('#backup_folder').val(response.backup_folder);
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
                        $('input[name="schedule_type_inbound"][value="'+response.schedule_type_inbound+'"]').prop('checked',true);
                        $('#occurs_time_inbound').val(response.occurs_inbound).change();
                        //$('#recurs_count_inbound').val(response.recurs_count_inbound);
                        //$('#recurs_time_inbound').val(response.recurs_time_inbound);
                     
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
                    //alert("Setting saved successfully");
                    sweetAlert("success", "Inbound Setting Saved Successfully", "success");
                    //$("#inbound_setting_id").val(response.id);
                  }
                });
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
                    $("#outbound_setting_id").val(response.id);
                  }
                });
              }
            }
            else if(index == 3)
            {
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
            numberedStepper.next();
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
              }
            });
          }
         }
      })
      $('#is_active_inbound').on('click',function(e){
        var is_active = $(this).data('value');
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
              }
            });
          }
         }
      })
      $('#is_active_outbound').on('click',function(e){
        var is_active = $(this).data('value');
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
                    alert("Outbound Setting saved successfully");
                    //$("#outbound_setting_id").val(response.id);
                  }
                });
              }
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
          var project_id = $('#project_id').val();
          console.log($('input[name="s_configure"]:checked').val());
          
          var Schedule_configure_inbound = $('input[name="s_configure_inbound"]:checked').val();
          var schedule_type_inbound = $('input[name="schedule_type_inbound"]:checked').val();
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
          var daily_frequency_every_time_count_start_outbound=$('#daily_frequency_every_time_count_outbound').val();
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
         
          var Schedule_configure_outbound = $('input[name="s_configure_inbound"]:checked').val();
          var schedule_type_outbound = $('input[name="schedule_type_outbound"]:checked').val();
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
          if(schedule_setting_id=="")
          {
            $.ajax({
              url:'/schedule_setting/save',  
              method:'post',  
              dataType:'json',
              data:{project_id:project_id,
                Schedule_configure_inbound:Schedule_configure_inbound,
                schedule_type_inbound:schedule_type_inbound,
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
                duration_outbound_end_date:duration_outbound_end_date
              },
              success:function(response){
                console.log(response);
                sweetAlert("success", "Setting Saved Successfully", "success");
                $("#schedule_setting_id").val(response.id);
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
                duration_outbound_end_date:duration_outbound_end_date
              },
              success:function(response){
                //console.log(response);
                sweetAlert("success", "Schedule Setting Saved Successfully", "success");
                //$("#schedule_setting_id").val(response.id);
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

  }

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
