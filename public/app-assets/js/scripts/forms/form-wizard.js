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
            required: true
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
          api_url: {
            required: true
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
          recurs_count: {
            required: true
          },
          recurs_time: {
            required: true
          },
          
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
                    alert("project saved successfully");
                    console.log(response);
                  }
                });
              }

              //console.log(project_detail);
            }
            else if(index==1)
            {
              var inbound_setting_id = $("#inbound_setting_id").val();
              var inbound_format = $('#inboundFormat').val();
              var sync_type = $('input[name="sync_type"]:checked').val();
              var ftp_server_link = $('#ftp_server_link').val();
              var host = $('#host').val();
              var port = $('#port').val();
              var login_name = $('#login_name').val();
              var password = $('#password').val();
              var project_id = $('#project_id').val();
              if(inbound_setting_id=="")
              {

                $.ajax({
                  url:'/inbound_setting/save',  
                  method:'post',  
                  dataType:'json',
                  data:{project_id:project_id,inbound_format:inbound_format,sync_type:sync_type,ftp_server_link:ftp_server_link,host:host,port:port,login_name:login_name,password:password},
                  success:function(response){
                    console.log(response);
                    //alert("Setting saved successfully");
                    $("#inbound_setting_id").val(response.id);
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
              if(outbound_setting_id=="")
              {
                $.ajax({
                  url:'/outbound_setting/save',  
                  method:'post',  
                  dataType:'json',
                  data:{project_id:project_id,sync_type_out:sync_type_out,api_url:api_url,outbound_format:outbound_format},
                  success:function(response){
                    console.log(response);
                    //alert("Setting saved successfully");
                    $("#outbound_setting_id").val(response.id);
                  }
                });
              }
            }
            else if(index == 3)
            {
              var schedule_setting_id = $('#schedule_setting_id').val();
              var project_id = $('#project_id').val();
              console.log($('input[name="s_configure"]:checked').val());
              
              var Schedule_configure_inbound = $('input[name="s_configure_inbound"]:checked').val();
              var schedule_type_inbound = $('input[name="schedule_type"]:checked').val();
              var occurs_inbound =$('#occurs_time_inbound').val();
              var recurs_count_inbound =$('#recurs_count_inbound').val();
              var recurs_time_inbound =$('#recurs_time_inbound').val();
             
              var Schedule_configure_outbound = $('input[name="s_configure_inbound"]:checked').val();
              var schedule_type_outbound = $('input[name="schedule_type"]:checked').val();
              var occurs_outbound =$('#occurs_time_inbound').val();
              var recurs_count_outbound =$('#recurs_count_inbound').val();
              var recurs_time_outbound =$('#recurs_time_inbound').val();
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
                    recurs_count_inbound:recurs_count_inbound,
                    recurs_time_inbound:recurs_time_inbound,
                    Schedule_configure_outbound:Schedule_configure_outbound,
                    schedule_type_outbound:schedule_type_outbound,
                    occurs_outbound:occurs_outbound,
                    recurs_count_outbound:recurs_count_outbound,
                    recurs_time_outbound:recurs_time_outbound
                  },
                  success:function(response){
                    console.log(response);
                    //alert("Setting saved successfully");
                    $("#schedule_setting_id").val(response.id);
                  }
                });
              }
            }
            else if(index == 4)
            {
              
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
                    alert("project saved successfully");
                    //console.log(response);
                    $('#project_id').val(response.id);
                  },
                
                })
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
          var host = $('#host').val();
          var port = $('#port').val();
          var login_name = $('#login_name').val();
          var password = $('#password').val();
          var project_id = $('#project_id').val();
          if(inbound_setting_id=="")
          {

            $.ajax({
              url:'/inbound_setting/save',  
              method:'post',  
              dataType:'json',
              data:{project_id:project_id,inbound_format:inbound_format,sync_type:sync_type,ftp_server_link:ftp_server_link,host:host,port:port,login_name:login_name,password:password},
              success:function(response){
                console.log(response);
                //alert("Setting saved successfully");
                $("#inbound_setting_id").val(response.id);
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
                  data:{project_id:project_id,sync_type_out:sync_type_out,api_url:api_url,outbound_format:outbound_format},
                  success:function(response){
                    console.log(response);
                    //alert("Setting saved successfully");
                    $("#outbound_setting_id").val(response.id);
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
          var InboundSetting = JSON.stringify(inbound_server_detail);
          var OutboundSetting = JSON.stringify(outbound_detail);
          var ScheduleSetting = JSON.stringify(schedule_detail);
          var data = {ProjectName:project_detail.ProjectName,ProjectCode:project_detail.ProjectCode,CompanyName:project_detail.CompanyName,InboundSetting:inbound_server_detail,OutboundSetting:outbound_detail,ScheduleSetting:schedule_detail}
          //var inboundjson = JSON.stringify(inbound_server_detail);
          //var 
          $.ajax({
            url:'/projects/save',  
            method:'post',  
            dataType:'json', 
            data:{ProjectName:project_detail.ProjectName,ProjectCode:project_detail.ProjectCode,CompanyName:project_detail.CompanyName,InboundSetting:InboundSetting,OutboundSetting:OutboundSetting,ScheduleSetting:ScheduleSetting},
            success:function(response){
                 //console.log(response);
                //  var counter = 1;
                //  $.each(response.data,function(index,data){  
                //     table.row.add( [
                //      counter++,
                //      data.user_name,
                //      data.display_name,
                //      data.staff_other_code,
                //      data.enable_fg,
                //      '<button class="btn btn-success">Edit</button>'
                //     ]).draw( false );
                //  });  
                //  $('body').find('.paginate_button').addClass('btn m-10 btn-sm btn-outline-primary  p-10');
                console.log(response);
              },  
            error:function(response){  
                alert('server error');  
            }  
          })
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
        alert('Submitted..!!');
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
        alert('Submitted..!!');
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
