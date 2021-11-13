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
                     $button_group+='<a href="edit/'+data._id+'" class="btn btn-secondary">Edit</a>';
                    if(data.inbound_setting!=undefined && data.outbound_setting!=undefined && data.schedule_setting!=undefined)
                    {
                        if(data.isActive==0)
                        {
                            $button_group+='<button type="button" class="btn btn-secondary">Active</button>';
                        }
                        else
                        {
                            $button_group+='<button type="button" class="btn btn-secondary">InActive</button>';
                        }
                    }
                    if(data.schedule_setting!=undefined && data.schedule_setting.Schedule_configure_inbound=='click_by_user')
                    {
                        $button_group+='<button type="button" data-project-id="'+data.inbound_setting.project_id+'" data-host="'+data.inbound_setting.host+'" data-port="'+data.inbound_setting.port+'" data-username="'+data.inbound_setting.login_name+'" data-password="'+data.inbound_setting.password+'" data-folder="'+data.inbound_setting.folder+'" data-is-password-encrypted="'+data.inbound_setting.is_password_encrypted+'" class="btn run_inbound btn-secondary">RunInbound</button>';
                    }
                    if(data.schedule_setting!=undefined && data.schedule_setting.Schedule_configure_outbound=='click_by_user')
                    {
                        $button_group+='<button type="button" class="btn btn-secondary run_outbound">RunOutbound</button>'
                    }
                    $button_group+='<button type="button" class="btn btn-secondary">View</button></div>';
                    table.row.add( [
                     counter++,
                     data.CompanyName,
                     data.ProjectCode,
                     data.ProjectName,
                     '-','-','-','-',
                     $button_group
                    ]).draw( false );
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
        $.ajax({
            url:'/projects/download',
            method:'post',
            dataType:'json',
            data:{host:host,username:username,password:password,port:port,project_id:project_id,folder:folder,is_password_encrypted:is_password_encrypted},
            success:function(response){
                if(response.status=="false")
                {
                    alert(response.msg);
                }
                else
                {
                    alert(response.msg);
                }
            }
        })
    });
    $('body').on('click','.run_outbound',function(){
        $.ajax({  
            url:'/outbound/runbyuser',  
            method:'post',  
            dataType:'json', 
            data:{page:0,limit:3},
            success:function(response){
                alert(response.body);
            }
        });
    });
});