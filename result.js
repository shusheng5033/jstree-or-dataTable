// 初始化js树 数据
function initTree(){
    $.ajax({
        url:'./json/data.json',
        dataType:'json',
        success:function(data){
            console.log(123)
            console.log(data);
            // 根据检索关键字对data进行过滤,
                var s_value = sessionStorage.getItem("search_value");
                // console.log(s_value);
                // console.log(data);
                console.log($('#tree_left'))
                // var root_data = data.slice();
                console.log(s_value)
                console.log(data)
                var ser_result = [];
                $.each(data,function(a,b){
                    for(var i = b.children.length-1;i>=0;i--){
                        var s_id = b.children[i].id+'';
                        var s_txt = b.children[i].text;
                        if(s_id.indexOf(s_value)==-1 && s_txt.indexOf(s_value)==-1){
                                    b.children.splice(i,1);
                        }
                    }
                })
                // $('#tree_left').jstree(true).refresh();
            $('#tree_left').jstree({
                'core':{
                    'data':data,
                },
            })
            $("#tree_left").on('ready.jstree',function(a,b){
                $('<span/>',{
                        class:'num'
                    }).appendTo('.jstree-node');
                for(var i = 0; i<data.length;i++){
                    var num = data[i].children.length;
                    $('.num').eq(i).text("("+num+")");
                }
            })
            $("#tree_left").on('changed.jstree',function(a,b){
                var select_id = b.instance.get_selected(true)[0].id;
                // console.log(select_id);
                for(var i =0;i<data.length;i++){
                    if(select_id == data[i].id){
                        var dataJson = data[i].children;
                        // console.log(dataJson)
                        initTable(dataJson);
                        break;
                    }
                }
            })  
        }
    })
}
// 初始化表格数据
function initTable(data){
    var table = $('#data_table').DataTable({
        data:data,
        columns:[
            {data:'id'},
            {data:'text'},
        ],
        destroy:true,
        renderer: "bootstrap",
        searching : false, 
        bLengthChange: false,
    });
}
// 点击控制元素的显示与隐藏方法
function click_trigger(select,select_to){
    var adminflag = false;
    select.on('click',function(){
        if(!adminflag){
            select_to.css('display','block');
            adminflag = true;
        } else {
            select_to.css('display','none');
            adminflag = false;
        }
    })
}
click_trigger($('.admin'),$('.adminModel'));
// 搜索事件
$("#search_button").on('click',function(e){
    if($.trim($('#search_value').val()).length){  //清除字符串两端的额空格
        // 加载搜索结果页面
        $(".result").load('result.html')
        var s_value = $('#search_value').val();
        if(sessionStorage.getItem("search_value")){
            sessionStorage.removeItem("search_value");
             // 将检索关键字放到session里
             sessionStorage.setItem("search_value", s_value);
             initTree();
        } else {
            // 将检索关键字放到session里
            sessionStorage.setItem("search_value", s_value);
        }
    } else {
        alert("请输入搜索内容");
    }
})