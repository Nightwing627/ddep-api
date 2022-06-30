//const { ids } = require("webpack");

$(document).ready(function(){
    var table = $('#project_data_table').DataTable({
        "aLengthMenu": [[1,10, 20, 50,100, -1], [1,10, 20 ,50, 100, "All"]],
        "iDisplayLength": 50,
        "pagingType": "full_numbers",
        //"pagingType": "simple"
        
        
    });
    //$('.dataTables_filter').addClass('btn m-5 btn-sm btn-dark');
   
    getdata();
    function getdata(){  
        $.ajax({  
            url:'/projects/fulllist',  
            method:'get',  
            dataType:'json', 
            //data:{page:0,limit:3},
            success:function(response){
                   
                 var counter = 1;
                 $.each(response.data,function(index,data){
                     var $button_group='<div class="btn-group" role="group" aria-label="Basic example">';
                     $button_group+='<a href="edit/'+data._id+'" class="btn btn-secondary">Edit</a><button type="button" data-toggle="modal" data-target="#history" class="btn btn-outline-secondary" style="display: none;">History</button>';
                    if(data.inbound_setting!=undefined && data.outbound_setting!=undefined && (data.schedule_setting!=undefined || data.inbound_setting.sync_type == 'API'))
                    {
                        if(data.isActive==0)
                        {
                            $button_group+='<button type="button" data-value="1" data-id="'+data._id+'" class="btn btn-secondary btn_is_active">Inactive</button>';
                        }
                        else
                        {
                            $button_group+='<button type="button" data-value="0" data-id="'+data._id+'" class="btn btn-outline-success btn_is_active">Active</button>';
                        }
                    }
                    if(data.schedule_setting!=undefined && data.schedule_setting.Schedule_configure_inbound=='click_by_user')
                    {
                        $button_group+='<button type="button" data-project-id="'+data.inbound_setting.project_id+'" data-host="'+data.inbound_setting.host+'" data-port="'+data.inbound_setting.port+'" data-username="'+data.inbound_setting.login_name+'" data-password="'+data.inbound_setting.password+'" data-folder="'+data.inbound_setting.folder+'" data-is-password-encrypted="'+data.inbound_setting.is_password_encrypted+'" data-project-code="'+data.ProjectCode+'" data-is-active="'+data.inbound_setting.is_active+'" class="btn run_inbound btn-secondary">RunInbound</button>';
                    }
                    if(data.schedule_setting!=undefined && data.schedule_setting.Schedule_configure_outbound=='click_by_user')
                    {
                        $button_group+='<button type="button" data-project-id="'+data.inbound_setting.project_id+'" data-is-active="'+data.outbound_setting.is_active+'" data-project-code="'+data.ProjectCode+'"  class="btn btn-secondary run_outbound">RunOutbound</button>'
                    }
                    
                    $button_group+='<button type="button" class="btn btn-secondary">View</button></div>';
                    var last_run_inbound = '-';
                    var last_run_inbound_date = '-';
                    var last_run_outbound = '-';
                    var last_run_outbound_date = '-';
                    if(data.inbound_history!=undefined && data.inbound_history.length >0)
                    {
                        if (data.inbound_history[0].status=="success")
                        {
                          last_run_inbound = '<button type="button" class="btn btn-success round waves-effect">success</button>';
                        }
                        else
                        {
                          last_run_inbound = '<button type="button" class="btn btn-danger round waves-effect">Fail</button>';

                        }
                        last_run_inbound_date = new Date(data.inbound_history[0].createdAt).toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
                    }
                    if(data.outbound_history!=undefined && data.outbound_history.length >0)
                    {
                        if (data.outbound_history[0].status=="success")
                        {
                          last_run_outbound = '<button type="button" class="btn btn-success round waves-effect">success</button>';
                        }
                        else
                        {
                          last_run_outbound = '<button type="button" class="btn btn-danger round waves-effect">Fail</button>';

                        }
                        last_run_outbound_date = new Date(data.outbound_history[0].createdAt).toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
                    }
                    table.row.add( [
                     counter++,
                     data.CompanyName,
                     data.ProjectCode,
                     data.ProjectName,
                     last_run_inbound,last_run_inbound_date,last_run_outbound,last_run_outbound_date,
                     $button_group
                    ]).draw( false );
                    if(data.isActive==0)
                    {
                      //alert("ram");
                      $('#project_data_table tr').last().addClass('table-secondary');
                    }
                 });  
                 $('body').find('.paginate_button').addClass('btn m-10 btn-sm btn-outline-primary  p-10');
            },  
            error:function(response){  
                alert('server error');  
            }  
        });  
    }  
    $('body').on('click','.run_inbound',function(){
        // $.ajax({  
        //     url:'/inbound/runbyuser',  
        //     method:'post',  
        //     dataType:'json', 
        //     data:{page:0,limit:3},
        //     success:function(response){
        //         alert(response.body);
        //     }
        // })
        var host = $(this).data('host');
        var username = $(this).data('username');
        var password = $(this).data('password');
        var port = $(this).data('port');
        var project_id = $(this).data('project-id');
        var folder = $(this).data('folder');
        var is_password_encrypted = $(this).data('is-password-encrypted');
        var project_code = $(this).data('project-code');
        var is_active = $(this).data('is-active');
        if(is_active=="Active")
        {

            $.ajax({
                url:'/inbound/inboundrun',
                method:'post',
                dataType:'json',
                data:{project_id:project_id},
                success:function(response){
                    if(response.status=="0")
                    {
                      sweetAlert("success", response.Msg, "success");
                    }
                    else
                    {
                      sweetAlert("fail", response.Msg, "fail");
                    }
                }
            })
        }
        else
        {
            alert("Inbound is Inactive");
        }
    });
    $('body').on('click','.run_outbound',function(){
        var project_id = $(this).data('project-id');
        var project_code = $(this).data('project-code');
        var is_active = $(this).data('is-active');
        if(is_active=="Active")
        {
            $.ajax({  
                url:'/inbound/outboundrun',  
                method:'post',  
                dataType:'json', 
                data:{project_id:project_id ,project_code:project_code},
                success:function(response){
                    if(response.Status==1)
                    {
                        alert(response.Msg);
                    }
                    else
                    {
                        alert(response.Msg);
                    }
                }
            });
        }
        else
        {
            alert("Outbound is Inactive");
        }
       
    });
    $('body').on('click','.btn_is_active',function(){
        var isActive = $(this).data('value');
        var project_id = $(this).data('id');
        var $this = $(this);
        $.ajax({
            url:'/projects/update/'+project_id,  
            method:'put',  
            dataType:'json',
            data:{isActive:isActive},
            success:function(response){
                if(response.status==1)
                {

                    if(isActive==1)
                    {
                        $this.data('value','0');
                        $this.html('Active');
                        $this.removeClass('btn-secondary');
                        $this.addClass('btn-outline-success');
                        sweetAlert("success", response.message, "success");
                        $this.parents('tr').removeClass('table-secondary');
                        //alert(response.message);
                    }
                    else
                    {
                        $this.data('value','1');
                        $this.html('Inactive');
                        $this.addClass('btn-secondary');
                        $this.removeClass('btn-outline-success');
                        sweetAlert("success", response.message, "success");
                        $this.parents('tr').addClass('table-secondary');
                    }
                }
                else
                {
                  sweetAlert("fail", response.message, "fail");
                }
              //alert(response.message);
              //console.log(response);
            }
          });
    });
    $('#btn_create_new_project').on('click',function(){
        window.location.href="/projects/add";
    })
    (function (window, document, $) {
        'use strict';
      
        // Default Spin
        $('.touchspin').TouchSpin({
          buttondown_class: 'btn btn-primary',
          buttonup_class: 'btn btn-primary',
          buttondown_txt: feather.icons['minus'].toSvg(),
          buttonup_txt: feather.icons['plus'].toSvg()
        });
      
        // Icon Change
        $('.touchspin-icon').TouchSpin({
          buttondown_txt: feather.icons['chevron-down'].toSvg(),
          buttonup_txt: feather.icons['chevron-up'].toSvg()
        });
      
        // Min - Max
      
        var touchspinValue = $('.touchspin-min-max'),
          counterMin = 17,
          counterMax = 21;
        if (touchspinValue.length > 0) {
          touchspinValue
            .TouchSpin({
              min: counterMin,
              max: counterMax,
              buttondown_txt: feather.icons['minus'].toSvg(),
              buttonup_txt: feather.icons['plus'].toSvg()
            })
            .on('touchspin.on.startdownspin', function () {
              var $this = $(this);
              $('.bootstrap-touchspin-up').removeClass('disabled-max-min');
              if ($this.val() == counterMin) {
                $(this).siblings().find('.bootstrap-touchspin-down').addClass('disabled-max-min');
              }
            })
            .on('touchspin.on.startupspin', function () {
              var $this = $(this);
              $('.bootstrap-touchspin-down').removeClass('disabled-max-min');
              if ($this.val() == counterMax) {
                $(this).siblings().find('.bootstrap-touchspin-up').addClass('disabled-max-min');
              }
            });
        }
      
        // Step
        $('.touchspin-step').TouchSpin({
          step: 5,
          buttondown_txt: feather.icons['minus'].toSvg(),
          buttonup_txt: feather.icons['plus'].toSvg()
        });
      
        // Color Options
        $('.touchspin-color').each(function (index) {
          var down = 'btn btn-primary',
            up = 'btn btn-primary',
            $this = $(this);
          if ($this.data('bts-button-down-class')) {
            down = $this.data('bts-button-down-class');
          }
          if ($this.data('bts-button-up-class')) {
            up = $this.data('bts-button-up-class');
          }
          $this.TouchSpin({
            mousewheel: false,
            buttondown_class: down,
            buttonup_class: up,
            buttondown_txt: feather.icons['minus'].toSvg(),
            buttonup_txt: feather.icons['plus'].toSvg()
          });
        });
      })(window, document, jQuery);
});