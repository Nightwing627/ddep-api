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
                    alert(response.message);
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
                      $('#host').val(response.host);
                      $('#port').val(response.port);
                      $('#login_name').val(response.login_name);
                      $('#password').val(response.password);
                      $('input[value="'+response.sync_type+'"]').prop('checked',true);
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
                        $('#occurs_time_inbound').val(response.occurs_inbound);
                        $('#recurs_count_inbound').val(response.recurs_count_inbound);
                        $('#recurs_time_inbound').val(response.recurs_time_inbound);
                     
                       $('input[name="s_configure_outbond"][value="'+response.Schedule_configure_outbound+'"]').prop('checked',true);
                       $('input[name="schedule_type_outbound"][value="'+response.schedule_type_outbound+'"]').prop('checked',true);
                       $('#occurs_time_inbound').val(response.occurs_outbound);
                       $('#recurs_count_outbound').val(response.recurs_count_outbound);
                       $('#recurs_time_outbound').val(response.recurs_time_outbound);
                       $("#schedule_setting_id").val(response._id);
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
              var host = $('#host').val();
              var port = $('#port').val();
              var login_name = $('#login_name').val();
              var password = $('#password').val();
             
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
              else
              {
                $.ajax({
                  url:'/inbound_setting/update/'+inbound_setting_id,  
                  method:'put',  
                  dataType:'json',
                  data:{project_id:project_id,inbound_format:inbound_format,sync_type:sync_type,ftp_server_link:ftp_server_link,host:host,port:port,login_name:login_name,password:password},
                  success:function(response){
                    //console.log(response);
                    alert("Setting saved successfully");
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
              if(outbound_setting_id=="")
              {
                $.ajax({
                  url:'/outbound_setting/save',  
                  method:'post',  
                  dataType:'json',
                  data:{project_id:project_id,sync_type_out:sync_type_out,api_url:api_url,outbound_format:outbound_format},
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
                  data:{project_id:project_id,sync_type_out:sync_type_out,api_url:api_url,outbound_format:outbound_format},
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
              else
              {
                $.ajax({
                  url:'/projects/update/'+project_id,  
                  method:'put',  
                  dataType:'json',
                  data:{ProjectName:project_detail.ProjectName,ProjectCode:project_detail.ProjectCode,CompanyName:project_detail.CompanyName},
                  success:function(response){
                    alert(response.message);
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
          else
          {
            $.ajax({
              url:'/inbound_setting/update/'+inbound_setting_id,  
              method:'put',  
              dataType:'json',
              data:{project_id:project_id,inbound_format:inbound_format,sync_type:sync_type,ftp_server_link:ftp_server_link,host:host,port:port,login_name:login_name,password:password},
              success:function(response){
                //console.log(response);
                alert("Setting saved successfully");
                //$("#inbound_setting_id").val(response.id);
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
              else
              {
                $.ajax({
                  url:'/outbound_setting/update/'+outbound_setting_id,  
                  method:'put',  
                  dataType:'json',
                  data:{project_id:project_id,sync_type_out:sync_type_out,api_url:api_url,outbound_format:outbound_format},
                  success:function(response){
                    //console.log(response);
                    alert("Setting saved successfully");
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
          var occurs_inbound =$('#occurs_time_inbound').val();
          var recurs_count_inbound =$('#recurs_count_inbound').val();
          var recurs_time_inbound =$('#recurs_time_inbound').val();
         
          var Schedule_configure_outbound = $('input[name="s_configure_inbound"]:checked').val();
          var schedule_type_outbound = $('input[name="schedule_type_outbound"]:checked').val();
          var occurs_outbound =$('#occurs_time_inbound').val();
          var recurs_count_outbound =$('#recurs_count_outbound').val();
          var recurs_time_outbound =$('#recurs_time_outbound').val();
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
                alert("Setting saved successfully");
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
                recurs_count_inbound:recurs_count_inbound,
                recurs_time_inbound:recurs_time_inbound,
                Schedule_configure_outbound:Schedule_configure_outbound,
                schedule_type_outbound:schedule_type_outbound,
                occurs_outbound:occurs_outbound,
                recurs_count_outbound:recurs_count_outbound,
                recurs_time_outbound:recurs_time_outbound
              },
              success:function(response){
                //console.log(response);
                alert("Setting saved successfully");
                //$("#schedule_setting_id").val(response.id);
              }
            });
          }
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
