$(document).ready(function(){
    // 获取评论并打印评论
    getComments();

    /**
     * 绑定点赞事件
     */
    bindPraise();
});

/**
 * 获取评论并打印评论
 * 一次返回20条一级评论包括其子评论
 */
function getComments(){
    $.ajax({
        type: 'GET',
        url: "",
        data: '',
        success: function (response) {
            var result = jQuery.parseJSON(response);
            // console.log(result);

            if(result.length != 0){
                printComments(result);
            }
            else{
                $("#readMore").hide();
            }
        },
        error: function(response){
            console.log(response);
            // alert("Sorry，请求评论失败...");
            $("#readMore").hide();
        }
    });
}


/**
 * 查看更多评论，若没有更多评论，则隐藏查看更多按钮
 */
function readMore(){
    getComments();
}


/**
 * 打印评论
 */
function printComments(data){
    for(var i = 0 ; i < data.length ; i++){
        printFirstLevelComment(data[i]['commentid'],data[i]['commentText'],data);
        for(var j = 0 ; j < data[i]['childComments'].length ; j++ ){
            printSecondLevelComment(data[i]['commentid'],data[i][j]['commentText'],data[i][j]);
        }
    }
}


/**
 * 判断两次输入的密码是否相同
 */
function matchPasswd(){
    var first = $("#first").val();
    var second = $("#second").val();

    if(first != second){
        $("#first").val('');
        $("#second").val('');
        alert('两次输入的密码不同，请重新输入')
    }
}

//绑定点赞事件
function bindPraise(){
    var praiseButton = $('.praise');

    for(i = 0 ; i < praiseButton.length ; i++){
        console.log(i);
        $(praiseButton[i]).on('click',function(){
            var id = $(this).data('id');
            console.log(id);

            var praiseNum = $(this).next().html();
            praiseNum++;
            $(this).next().html(praiseNum);

            $.ajax({
                type: 'POST',
                url: "",
                data: id,
                success: function (response) {
                    // 这里要返回点赞数
                    var praiseNum = jQuery.parseJSON(response);
                    // console.log(result);
                    // var praiseNum = $(this).next().html();
                    // praiseNum++;
                    $(this).next().html(praiseNum);
                },
                error: function(response){
                    console.log(response);
                }
            });
        });
    }
}


/**
 * 发表评论，发表对该新闻的评论
 */
function comment() {  
    var commentText = $('#commentTextarea').val();
    var formData = new FormData();
    formData.append(commentText);
    $.ajax({
        method:'POST',
        url:'',
        data:formData,
        success:function(response){
            var result = jQuery.parseJSON(response);
            // console.log(result);
            if(result['status'] == 1){
                printFirstLevelComment(result['commentid'],commentText,result);
            }
            else{
                alert('发表失败...');
            }
        },
        error:function(response){
            console.log(response);
            // alert(response);
        }
    });
}

/**
 * 删除回复输入框
 */
function removeReply(node) {
    var parent = $(node).parents()[1];
    $(parent).remove();

    var id = "#" + $(node).data('commentid');
    $(id).show();
}

/**
 * 创建回复评论输入框
 */
function createReply(node) {  
    var model = '<div class="uk-margin">\
                    <textarea class="uk-textarea textSize" rows="3" placeholder="输入你的回复"></textarea>\
                    <p class="uk-float-right" style="margin-bottom: 1rem;" uk-margin>\
                        <button data-commentid="{{commentid}}" onclick="removeReply(this)" class="uk-button uk-button-default" type="button">取消</button>\
                        <button data-commentid="{{commentid}}" onclick="replyComment(this)" class="uk-button uk-button-primary">回复</button></p><hr>\
                </div>';

    var commentid = $(node).data('commentid');
    console.log(commentid);
    var tmp_model = model.replace(/{{commentid}}/g,commentid);
    var parent = $(node).parents()[2];
    $(parent).after($(tmp_model));

    $("#" + commentid).hide();
}

/**
 * 回复一级或二级评论
 * 这里会获取要回复的那条评论的ID以及回复的内容，然后发送给服务器
 * 
 * 如果回复的是一级评论，则需要服务器返回评论是否保存成功的信息、保存时间、点赞数、
 * 正在发布的评论的ID以及正在发布这条评论的用户的头像路径和用户名
 * 
 * 若回复的是二级评论，则 还 需要服务器返回被回复的那条评论的内容以及用户名
 * 
 * 一级评论的ID只有一个数，二级评论的ID会用‘-’与被回复的一级评论的ID连起来，如'0-0'
 */
function replyComment(node){
    //获取评论内容
    var commentText = $(node).parent().prev().val();
    //被回复的那条评论的ID
    var repliedCommentid = $(node).data('commentid');

    console.log(commentText);
    console.log(repliedCommentid);
    
    var formData = new FormData();
    formData.append('commentid',repliedCommentid);
    formData.append('commentText',commentText);
    $.ajax({
        type: 'POST',
        url: "",
        data: formData,
        success: function (response) {
            var result = jQuery.parseJSON(response);
            // console.log(result);
            
            //如果服务器端没有问题，就添加评论节点
            if(result['status'] == 1){
                /**
                 * 判断被回复的是一级评论还是二级评论
                 * 评论ID（repliedCommentid）中包含'-'的为二级评论
                 */
                if(repliedCommentid.search('-') >= 0){
                    printSecondLevelComment(repliedCommentid,commentText,result);
                }
                else{
                    printFirstLevelComment(repliedCommentid,commentText,result);
                }
            }
            else{
                alert('Sorry,评论失败！');
            }
        },
        error: function(response){
            console.log(response);
        }
    });
}

/**
 * 打印一级评论
 */
// var testdata = {'headUrl':'headUrl','username':'username','commentDate':'commentDate','commentid':'commentid','praiseNum':'praiseNum'};
// printFirstLevelComment(15,'asvasvas',testdata);
function printFirstLevelComment(repliedCommentid,commentText,data){

    var CommentModel = ' <ul class="uk-comment-list"><li><article class="uk-comment uk-comment-primary uk-visible-toggle" tabindex="-1"><header class="uk-comment-header uk-position-relative">\
                                        <div class="uk-grid-medium uk-flex-middle" uk-grid>\
                                            <div class="uk-width-auto">\
                                                <img class="uk-comment-avatar" src="{{headUrl}}" style="max-height:3rem;" alt="">\
                                            </div>\
                                            <div class="uk-width-expand">\
                                                <h4 class="uk-comment-title uk-margin-remove">{{username}}</h4>\
                                                <p class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">\
                                                    <span href="javascript:;">{{commentDate}}</span>&nbsp;&nbsp;\
                                                    <a class="praise" data-commentid="{{commentid}}" href="javascript:;"><em>点赞</em>&nbsp;&nbsp;<em>{{praiseNum}}</em></a>\
                                                </p>\
                                            </div>\
                                        </div>\
                                        <div class="uk-position-top-right uk-position-small">\
                                            <button onclick="createReply(this)" class="uk-text-muted" id="{{commentid}}" data-commentid="{{commentid}}">回复</button>\
                                        </div>\
                                    </header>\
                                    <div class="uk-comment-body">\
                                        <p>{{commentText}}</p>\
                                    </div>\
                                </article>\
                                <ul id="childBox{{repliedCommentid}}"></ul></li></ul><hr>';

    var tmp_model = CommentModel.replace(/{{headUrl}}/g,data['headUrl']).replace(/{{username}}/g,data['username'])
                    .replace(/{{commentDate}}/g,data['commentDate']).replace(/{{commentid}}/g,data['commentid'])
                    .replace(/{{praiseNum}}/g,data['praiseNum']).replace(/{{commentText}}/g,commentText)
                    .replace(/{{repliedCommentid}}/g,repliedCommentid);

    $('#commentsBox').append(tmp_model).append('<hr>');

}

/**
 * 打印二级评论
 */
// var testdata2 = {'headUrl':'headUrl','username':'username','commentDate':'commentDate','commentid':'commentid',
// 'praiseNum':'praiseNum','commentText':'commentText','repliedUsername':'repliedUsername','repliedComment':'repliedComment'};
// printSecondLevelComment(0,'asvasvas',testdata2);
function printSecondLevelComment(repliedCommentid,commentText,data){
    /**
     * 评论节点的模板
     * 决定不改这里之后，把model都改成一行
     */
    var CommentModel = '<li>\
                            <article class="uk-comment  uk-visible-toggle" tabindex="-1">\
                                <header class="uk-comment-header uk-position-relative">\
                                    <div class="uk-grid-medium uk-flex-middle" uk-grid>\
                                        <div class="uk-width-auto">\
                                            <img class="uk-comment-avatar" src="{{headUrl}}" style="max-height:3rem;" alt="">\
                                        </div>\
                                        <div class="uk-width-expand">\
                                            <h4 class="uk-comment-title uk-margin-remove">{{username}}</h4>\
                                            <p class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">\
                                                <span href="javascript:;">{{commentDate}}</span>&nbsp;&nbsp;\
                                                <a class="praise" data-commentid="{{commentid}}" href="javascript:;"><em>点赞</em>&nbsp;&nbsp;<em>{{praiseNum}}</em></a>\
                                            </p>\
                                        </div>\
                                    </div>\
                                    <div class="uk-position-top-right uk-position-small">\
                                        <button onclick="createReply(this)" class="uk-text-muted" id="{{commentid}}" data-commentid="{{commentid}}">回复</button>\
                                    </div>\
                                </header>\
                                <div class="uk-comment-body">\
                                    <p>{{commentText}}&nbsp;<span class="uk-text-primary">//回复{{repliedUsername}}:</span><span class="uk-text-muted"> {{repliedComment}}</span></p>\
                                </div>\
                                <hr>\
                            </article>\
                        </li>';

    /**
     * headUrl->头像路径，username->发布这条评论的用户名，commentDate->发布这条评论的时间，commentid->将要发布的这条评论的ID，
     * praiseNum->这条评论的点赞数(一开始为0)，commentText->这条评论的内容(不用服务器返回),repliedUsername->被回复的评论的用户名，
     * repliedComment->被回复的评论内容
     */

    var tmp_model = CommentModel.replace(/{{headUrl}}/g,data['headUrl']).replace(/{{username}}/g,data['username'])
                            .replace(/{{commentDate}}/g,data['commentDate']).replace(/{{commentid}}/g,data['commentid'])
                            .replace(/{{praiseNum}}/g,data['praiseNum']).replace(/{{commentText}}/g,commentText)
                            .replace(/{{repliedUsername}}/g,data['repliedUsername']).replace(/{{repliedComment}}/g,data['repliedComment']);

    var aNode = $(tmp_model);

    var id = new String();
    id = ''+ repliedCommentid;
    var childBox = '#childBox' + id.split('-')[0];
    $(childBox).append(aNode);
}

