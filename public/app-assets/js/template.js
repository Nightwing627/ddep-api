$(document).ready(function(){
    //console.log(add_form);
    if($('#form_template').length > 0)
    {
        var add_form = $('#form_template');

        add_form.validate({
            rules:{
                TemplateName:{
                    required:true
                },
                TemplateCode:{
                    required:true
                },
                TemplateType:{
                    required:true
                }
            }
        });
        $('#add_template_btn').on('click',function(e){
            e.preventDefault();
            var isValid = $('#form_template').valid();
            if(isValid)
            {
    
                var TemplateName = $('#TemplateName').val();
                var TemplateCode = $('#TemplateCode').val();
                var TemplateType = $('#TemplateType').val();
                var isActive = "InActive"
                $.ajax({
                    url:'/templates/save',  
                    method:'post',  
                    dataType:'json',
                    data:{TemplateName:TemplateName,TemplateCode:TemplateCode,TemplateType:TemplateType,isActive:isActive},
                    success:function(response){
                        sweetAlert("success", response.msg, "success");
                      //$('#project_id').val(response.id);
                      //console.log(response);
                      //numberedStepper.next();
                    },
                    error:function(textStatus,error)
                    {
                      return false;
                    }
                  });
            }
        })
    }
    

    // add templates
    if($('#basic-datatable').length > 0)
    {

        var table = $('#project_data_table').DataTable({
            "aLengthMenu": [[1,10, 20, 50,100, -1], [1,10, 20 ,50, 100, "All"]],
            "iDisplayLength": 50,
            "pagingType": "full_numbers",
            //"pagingType": "simple"
           
        });
        getdata();
        function getdata(){  
            $.ajax({  
                url:'/templates/list',  
                method:'get',  
                dataType:'json', 
                //data:{page:0,limit:3},
                success:function(response){
                       
                     var counter = 1;
                     $.each(response.data,function(index,data){
                         var $button_group='<div class="btn-group" role="group" aria-label="Basic example">';
                         $button_group+='<a href="edit/'+data._id+'" class="btn btn-secondary">Edit</a>';
                        
                        
                        $button_group+='<button type="button" class="btn btn-secondary">View</button><button type="button" class="btn btn-secondary btn-status" data-value="'+data.isActive+'" data-id="'+data._id+'">Active</button><button type="button"  class="btn btn-del-temp btn-success" data-id="'+data._id+'">Delete</button></div>';
                        
                        table.row.add( [
                         counter++,
                         data.TemplateCode,
                         data.TemplateName,
                         $button_group
                        ]).draw( false );
                        // if(data.isActive==0)
                        // {
                        //   //alert("ram");
                        //   $('#project_data_table tr').last().addClass('table-secondary');
                        // }
                     });  
                     $('body').find('.paginate_button').addClass('btn m-10 btn-sm btn-outline-primary  p-10');
                },  
                error:function(response){  
                    alert('server error');  
                }  
            });  
        } 

        $('body').on('click','.btn-del-temp',function(){
            var id = $(this).data('id');
            var $this = $(this);
            $.ajax({
                url:'/templates/delete/'+id,  
                method:'delete',  
                dataType:'json',
                success:function(response){
                    if(response.Status==1)
                    {
                        sweetAlert("success", response.msg, "success");
                        table
                        .row( $this.parents('tr') )
                        .remove()
                        .draw();
                    }
                    else
                    {
                        sweetAlert("fail", response.msg, "fail");
                    }
                },
                error:function(response){
                    alert('server error');
                }
            })

        })
        $('body').on('click','.btn-status',function(){
            var id = $(this).data('id');
            var isActive = $(this).data('value');
            var $this = $(this);
            var btn_class = '';
            var btn_html = '';
            if(isActive=="Active")
            {
                isActive="InActive";
                btn_class = 'btn-secondary';
                
            }
            else
            {
                isActive="Active";
                btn_class = 'btn-success';
            }
            $.ajax({
                url:'/templates/update/'+id,  
                method:'put',  
                dataType:'json',
                data:{isActive:isActive},
                success:function(response){
                    $this.data('value',isActive);
                    $this.removeClass('btn-secondary');
                    $this.removeClass('btn-success');
                    $this.addClass(btn_class);
                    $this.html(isActive);
                    sweetAlert("success", response.msg, "success");
                  //$('#project_id').val(response.id);
                  //console.log(response);
                  //numberedStepper.next();
                },
                error:function(textStatus,error)
                {
                  return false;
                }
              });

        })
    }
})