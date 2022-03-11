$(document).ready(function(){
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

    // add templates
    $('#add_template_btn').on('click',function(e){
        e.preventDefault();
        var TemplateName = $('#TemplateName').val();
        var TemplateCode = $('#TemplateCode').val();
        var TemplateType = $('#TemplateType').val();
        $.ajax({
            url:'/templates/save',  
            method:'post',  
            dataType:'json',
            data:{TemplateName:TemplateName,TemplateCode:TemplateCode,TemplateType:TemplateType},
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
    })
})