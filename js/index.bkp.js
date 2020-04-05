$(document).ready(function(){
    // var newsView = new NewsView();
    // console.log(newsView);
    getOrbit();
    getNewsView();
    getNewsDesc();
    getTotalNums();
});


// // 封装Ajax函数
// function Ajax(obj){
//     $.ajax({
//         type: obj.method,
//         url: obj.url,
//         data: obj.data,
//         success: function (response) {
//             obj.successResult = jQuery.parseJSON(response);
//         },
//         error: function(response){
//             obj.errorResult = response;
//         }
//     });
// }

// /**
//  * 打印节点函数
//  */
// function print(obj){
//     for(var i = 0 ; i < obj.result.length ; i++){
//         var aNode = obj.createNode();
//         obj.addNode(aNode);
//     }
// }

// /**
//  * 节点类
//  */
// function Node(method,url,AjaxData,) {
//     // method,url,AjaxData,successResult,errorResult均为与ajax函数相关参数
//     this.method = method;
//     this.url = url;
//     this.AjaxData = AjaxData;
//     this.successResult = null;
//     this.errorResult = null;
//     this.getData = Ajax(this);
//     //以下属性与打印节点相关
//     this.model;
//     this.createNode;
//     this.addNode;
//     this.print = print(this);
// }

// /**
//  * 新闻列表项类
//  */
// function NewsView (){
//     this.method = 'GET';
//     this.url = '/news/getNewsView';
//     this.AjaxData = '';
//     this.successResult = null;
//     this.errorResult = null;
//     this.getData = Ajax(this);
//     this.result = new Array('');

//     this.model = '<div class="row">\
//                     <div class="medium-4 large-6 columns">\
//                         <p><img src="{{imgUrl}}" alt="image for article" alt="article preview image"></p>\
//                     </div>\
//                     <div class="medium-8 large-6 columns">\
//                         <h5><a href="javascript:;">{{title}}</a></h5>\
//                         <p>\
//                             <span><i class="fi-calendar"> {{date}} &nbsp;&nbsp;</i></span>\
//                             <span><i class="fi-comments"> {{comments}} comments</i></span>\
//                         </p>\
//                         <p>{{summary}}</p>\
//                     </div>\
//                 </div>';
//     this.createNode = function () {
//         var tmp_model = this.model.replace(/{{imgUrl}}/g,data[i]['imgUrl']).replace(/{{title}}/g,data[i]['title'])
//                                 .replace(/{{date}}/g,data[i]['date']).replace(/{{comments}}/g,data[i]['comments'])
//                                 .replace(/{{summary}}/g,data[i]['summary']);    
//         //返回新建节点                   
//         return $(tmp_model);
//     };
//     this.addNode = function (aNode) {
//         $("#NewsList").append(aNode).append($('<hr>'));
//     }
//     this.print = print(this);
// }



// 获取新闻列表数据
function getNewsView(){
    $.ajax({
        type: 'GET',
        url: "/news/getNewsView",
        data: "",
        success: function (response) {
            var result = jQuery.parseJSON(response);
            // console.log(result);
            printNews(result);
            printPageNav();
        },
        error: function(response){
            console.log(response);
            alert("Sorry，请求新闻数据失败...");
        }
    });
}

// 打印新闻列表
function printNewsView(data){

    // var data = new Array();
    // data[0] = {'imgUrl':'../imgs/cat.jpg','title':'title','date':'date','comments':'commments','summary':'summary'};
    var model = '<div class="row">\
                    <div class="medium-4 large-6 columns">\
                        <p><img src="{{imgUrl}}" alt="image for article" alt="article preview image"></p>\
                    </div>\
                    <div class="medium-8 large-6 columns">\
                        <h5><a href="javascript:;">{{title}}</a></h5>\
                        <p>\
                            <span><i class="fi-calendar"> {{date}} &nbsp;&nbsp;</i></span>\
                            <span><i class="fi-comments"> {{comments}} comments</i></span>\
                        </p>\
                        <p>{{summary}}</p>\
                    </div>\
                </div>';

    for(var i = 0 ; i < data.length ; i++){
        //替换新闻列表项模板的特定字段
        //imgUrl-图片路径，title-标题，date-日期，comments-评论数，summary-文章概要
        var tmp_model = model.replace(/{{imgUrl}}/g,data[i]['imgUrl']).replace(/{{title}}/g,data[i]['title'])
                            .replace(/{{date}}/g,data[i]['date']).replace(/{{comments}}/g,data[i]['comments'])
                            .replace(/{{summary}}/g,data[i]['summary']);
        
        //创建节点                   
        var aNode = $(tmp_model);

        $("#NewsList").append(aNode).append($('<hr>'));
    }
}

//打印分页
function printPageNav(){
    var model = '<ul id="PageNav" class="pagination" role="navigation" aria-label="Pagination">\
                    <li class="disabled">上一页<span class="show-for-sr">page</span></li>\
                    <li class="current"><span class="show-for-sr">You\'re on page</span> 1</li>\
                    <li><a href="#" aria-label="Page 2">2</a></li>\
                    <li><a href="#" aria-label="Page 3">3</a></li>\
                    <li><a href="#" aria-label="Page 4">4</a></li>\
                    <li><a href="#" aria-label="Next page">下一页<span class="show-for-sr">page</span></a></li>\
                </ul>';

    $('#NewsList').append($(model));
}


//获取热度排行榜新闻
function getNewsDesc() {
    $.ajax({
        type: "GET",
        url: "/news/getNewsDesc",
        data: "",
        success: function (response) {
            var result = jQuery.parseJSON(response);
            // console.log(result);
            printNewsDesc(result);
        },
        error: function (response) {
            console.log(response);

        }
    });
}

//打印热度排行榜新闻
function printNewsDesc(data) {
    $('#NewsDesc').append($('<p class="lead">热度排行榜</p>'));

    var model = '<div class="card" style="width: 300px;">\
                    <div class="media-object-section">\
                        <img class="thumbnail" src="{{imgUrl}}">\
                    </div>\
                    <div class="card-section media-object-section small-8">\
                    <h5>{{title}}</h5></div>\
                </div>';

    for(var i = 0 ; i < data.length ; i++){
        var tmp_model = model.replace(/{{imgUrl}}/g,data[i]['imgUrl']).replace(/{{title}}/g,data[i]['title']);
        $("#NewsDesc").append(tmp_model);
    } 
}

//获取打印疫情数据
function getTotalNums(){
    $.ajax({
        type: "GET",
        url: "/epidemic/getTotalNums",
        data: "",
        success: function (response) {
            var result = jQuery.parseJSON(response);
            // console.log(result);
            $('#DomesticDiagnosis').html(result['DomesticDiagnosis']);
            $('#DomesticDeath').html(result['DomesticDeath']);
            $('#DomestiCure').html(result['DomestiCure']);
            $('#CasesAbroad').html(result['CasesAbroad']);
            $('#DiagnosisAbroad').html(result['DiagnosisAbroad']);
            $('#DeathAbroad').html(result['DeathAbroad']);
        },
        error: function (response) {
            console.log(response);

        }
    });
}

//获取轮播图
function getOrbit(){
    $.ajax({
        type: "GET",
        url: "",
        data: "",
        success: function (response) {
            var result = jQuery.parseJSON(response);
            // console.log(result);
            printOrbit(result);
        },
        error: function (response) {
            console.log(response);

        }
    });
}

//打印轮播图
function printOrbit(data) {
    var model = '<li class="orbit-slide">\
                    <figure class="orbit-figure">\
                        <img class="orbit-image slideImg" src="{{imgUrl}}" alt="Space">\
                        <figcaption class="orbit-caption">{{title}}</figcaption>\
                    </figure>\
                </li>';

    for(var i = 0 ; i < data.length ; i++){
        var tmp_model = model.replace(/{{imgUrl}}/g,data[i]['imgUrl']).replace(/{{title}}/g,data[i]['title']);
        var aNode = $(tmp_model);
        $('#OrbitUl').append(aNode);
    }
}