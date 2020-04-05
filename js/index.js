$(document).ready(function(){
    /**
     * 页面加载完成之后，依次填充轮播图，新闻列表，
     * 热度排行榜，确诊人数的节点
     */
    getOrbit();
    getNewsView('EpidemicNews');
    getNewsDesc();
    getTotalNums();

    /**
     * 点击疫情新闻按钮之后，向后台发送'EpidemicNews'，并自动打印节点
     * 以下三个按钮同理
     */
    $("#EpidemicNews").click(function () {
        if($('#EpidemicNews').attr('class') != 'isActive'){
            active(0);
            $('#NewsList').html('');
            getNewsView('EpidemicNews');
            $('#NewsList').append($('<div style="text-align: center;"><button id="LoadMore" class="button">加载更多</button></div>'));
        }
    });
    $("#PreventionKnowledge").click(function () {
        if($('#PreventionKnowledge').attr('class') != 'isActive'){
            active(1);
            $('#NewsList').html('');
            getNewsView('PreventionKnowledge');
            $('#NewsList').append($('<div style="text-align: center;"><button id="LoadMore" class="button">加载更多</button></div>'));
        }
    });
    $("#RumorRefuting").click(function () {
        if($('#RumorRefuting').attr('class') != 'isActive'){
            active(2);
            $('#NewsList').html('');
            getNewsView('RumorRefuting');
            $('#NewsList').append($('<div style="text-align: center;"><button id="LoadMore" class="button">加载更多</button></div>'));
        }        
    });

    //加载更多按钮
    $('#LoadMore').click(function() {
        var ids = new Array('EpidemicNews','PreventionKnowledge','RumorRefuting');
        for(i = 0 ; i < ids.length ; i++){
            if($('#'+ids[i]).attr('class') == 'isActive'){
                // console.log('hh')
                getNewsView(ids[i]);
            }
        }
    });
});

//修改新闻栏按钮
function active(num) {
    var ids = new Array('#EpidemicNews','#PreventionKnowledge','#RumorRefuting');
    $(ids[num]).addClass('isActive');
    for(i = 0 ; i < ids.length ; i++){
        if(i != num){
            $(ids[i]).removeClass("isActive");
        }
    }
}

// 获取新闻列表数据
function getNewsView(data){
    $.ajax({
        type: 'GET',
        url: "/news/getNewsView",
        data: data,
        success: function (response) {
            var result = jQuery.parseJSON(response);
            // console.log(result);
            printNewsView(result);
            printPageNav();
        },
        error: function(response){
            console.log(response);
            // alert("Sorry，请求新闻数据失败...");
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
                        <h5><a href="{{href}}" target="_blank">{{title}}</a></h5>\
                        <p>\
                            <span><i class="fi-calendar"> {{date}} &nbsp;&nbsp;</i></span>\
                            <span><i class="fi-comments"> {{comments}} comments</i></span>\
                        </p>\
                        <p>{{summary}}</p>\
                    </div>\
                </div>';

    for(var i = 0 ; i < data.length ; i++){
    // for(var i = 0 ; i < 20 ; i++){
        //替换新闻列表项模板的特定字段
        //imgUrl-图片路径，title-标题，date-日期，comments-评论数，summary-文章概要
        var tmp_model = model.replace(/{{imgUrl}}/g,data[i]['imgUrl']).replace(/{{title}}/g,data[i]['title'])
                            .replace(/{{date}}/g,data[i]['date']).replace(/{{comments}}/g,data[i]['comments'])
                            .replace(/{{summary}}/g,data[i]['summary']).replace(/{{href}}/g,data[i]['href']);
        
        //创建节点                   
        var aNode = $(tmp_model);

        $("#NewsList").append(aNode).append($('<hr>'));
    }
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
                    <h5><a href="{{href}}" target="_blank">{{title}}</a></h5></div>\
                </div>';

    for(var i = 0 ; i < data.length ; i++){
        var tmp_model = model.replace(/{{imgUrl}}/g,data[i]['imgUrl']).replace(/{{title}}/g,data[i]['title'])
                                    .replace(/{{href}}/g,data[i]['href']);
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
    var model = '<li class="is-active orbit-slide">\
                    <figure class="orbit-figure">\
                        <img class="orbit-image slideImg" src="{{imgUrl}}" alt="Space">\
                        <figcaption class="orbit-caption orbitCaption"><a href="{{href}}" target="_blank" style="color: white;">{{title}}</a></figcaption>\
                    </figure>\
                </li>';

    for(var i = 0 ; i < data.length ; i++){
        var tmp_model = model.replace(/{{imgUrl}}/g,data[i]['imgUrl']).replace(/{{title}}/g,data[i]['title'])
                                .replace(/{{href}}/g,data[i]['href']);
        var aNode = $(tmp_model);
        $('#OrbitUl').append(aNode);
    }
}
