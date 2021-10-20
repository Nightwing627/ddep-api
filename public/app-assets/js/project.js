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
            url:'/projects/list',  
            method:'get',  
            dataType:'json', 
            //data:{page:0,limit:3},
            success:function(response){
                 //console.log(response);
                 var counter = 1;
                 $.each(response.data,function(index,data){  
                    table.row.add( [
                     counter++,
                     data.CompanyName,
                     data.ProjectCode,
                     data.ProjectName,
                     '-','-','-','-',
                     '<div class="btn-group" role="group" aria-label="Basic example"><button type="button" class="btn btn-secondary">Edit</button><button type="button" class="btn btn-secondary">View</button></div>'
                    ]).draw( false );
                 });  
                 $('body').find('.paginate_button').addClass('btn m-10 btn-sm btn-outline-primary  p-10');
            },  
            error:function(response){  
                alert('server error');  
            }  
        });  
    }  
});