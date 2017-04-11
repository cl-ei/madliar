$(function(){
    function windowSizeConf(){
        var text_area_h = window.innerHeight - document.getElementById('content-border').offsetTop - 25 + "px";
        $("#input-text-area").css("height", text_area_h);
        $("#content-area").css("height", $("#input-area").height() + "px");
    }
    function insertStr(str){
        var obj = document.getElementById('input-text-area');
        if (document.selection) {
            var sel = document.selection.createRange();
            sel.text = str;
        }else if(typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
            var startPos = obj.selectionStart,
                endPos = obj.selectionEnd,
                cursorPos = startPos,
            tmpStr = obj.value;
            obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
            cursorPos += str.length;
            obj.selectionStart = obj.selectionEnd = cursorPos;
        }
    }
    windowSizeConf();
    oldContent = "";
    STARTF = /^[ ]*-{3,}[ |\n]*/;
    ENDF = /-{3,}\n?/;
    setInterval(function(){
        var newContent = $("#input-text-area").val();
        if (newContent != oldContent){
            oldContent = newContent;

            var startF = newContent.match(STARTF);
            if (startF){
                var trueContent = newContent.substr(startF[0].length),
                    endF = trueContent.match(ENDF);
                if (endF){
                    var endPos = endF[0].length + trueContent.search(ENDF);
                    var headerInfo =  trueContent.substr(0, endPos).split("\n"),
                        htmlTitle = "";
                    for(i in headerInfo){
                        var line = headerInfo[i].replace("：", ":");
                        var pos = line.indexOf(":");
                        if(line.substr(0, pos).indexOf("title") > -1){
                            htmlTitle = "<h2 id='main-title'>" + line.substr(pos+1).trim() + "</h2>";
                        }
                    }
                    $("#content-area")[0].innerHTML = htmlTitle + marked(trueContent.substr(endPos));
                    return ;
                }
            }
            $("#content-area")[0].innerHTML = marked(oldContent);
        }
    }, 400);
    function csrfSafeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function setSaveButton(status){
        if(status == "saving"){
            $("#prompt-save, #prompt-saved").css("display", "none");
            $("#prompt-saving").removeAttr("style");
        }else if(status == "saved"){
            $("#prompt-saving, #prompt-save").css("display", "none");
            $("#prompt-saved").removeAttr("style");
        }else{
            $("#prompt-saving, #prompt-saved").css("display", "none");
            $("#prompt-save").removeAttr("style");
        }
    }
    function sameOrigin(url) {
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                 var cookie = jQuery.trim(cookies[i]);
                 if (cookie.substring(0, name.length + 1) == (name + '=')) {
                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                     break;
                 }
             }
        }
        return cookieValue;
    }
    function regitProcess(data){
        console.log("regitProcess: ", data);
        var error = data["err"];
        if (error == "bad_password"){
            $('#reg-prompt')[0].innerHTML = "* 你输入了错误的邮箱或密码";
            $('#login-modal').modal();
        }else if(error == "send_faild"){
            $('#modal-prompt-text')[0].innerHTML = "* 抱歉，由于系统错误，验证邮件未能发送，请重试";
            $('#prompt-modal').modal();
        }else if((error == "send_succeed") || (error == "not_valid_email")){
            $('#send-succeed-modal').modal();
        }else if(error == 0){
            $("#min-nav").html('<a href="/blog/logout/">注销：'+data["email"]+'</a> - '+'<a href="#" onclick="showRecent()">近期</a>');
            document.getElementById('input-text-area').value = "";
        }
    }
    showRecent = function showRecent(){
        var data = new FormData($("#upload-file-form")[0]);
        data.set("file", null);
        data.set("act", "get_recent");
        $.ajax({
            url: "/blog/api/",
            type: "post",
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            success:function(data){
                parseRecent(JSON.parse(data));
            },
            error:function(e){
                console.log(e);
            }
        });
    }
    function parseRecent(data){
        console.log("recent data: ", data);
        if (data["err"] == 0){
            global_article = data["article"];
            console.log("global_article: ", global_article);
            var article_list = "";
            for (var i = 0; i < global_article.length; i++){
                article_list += "<li class='article-title'>"
                                + "<span class='article-title-list' data-index='"+ i +"'>"
                                + global_article[i]["time"]+"　　"+global_article[i]["title"] 
                                + "</span>"
                                + "<span class='share-btn' title='"+ global_article[i]["title"]+"'>"
                                + "<i class='fa fa-share' aria-hidden='true'></i>"
                                + "</span></li>";
            }
            $("#recent-article-list").html(article_list);
            $(".article-title-list").unbind("click").click(function(){
                var index = parseInt($(this).attr("data-index"));
                document.getElementById('input-text-area').value = global_article[index]["content"];
                $('#recent-article-modal').modal("hide");
            });
            $(".share-btn").unbind("click").click(function(){
                var data = new FormData();
                data.set("act", "set_share");
                data.set("title", $(this).attr("title"));
                $.ajax({
                    url: "/blog/api/",
                    type: "post",
                    data: data,
                    cache: false,
                    processData: false,
                    contentType: false,
                    success:function(data){
                        var data = JSON.parse(data);
                        console.log(data);
                        if(data["err"] == 0){
                            window.location.href = "/blog/share/"+data["f_key"];
                        }
                    },
                    error:function(e){
                        console.log(e);
                    }
                });
            });
            global_image = data["image"];
            var image_list = ""
            for (var i = 0; i < global_image.length; i++){
                image_list += "<img src=" + global_image[i] + " class='image-title-list' data-dismiss='modal'/>";
            }
            $("#image-list")[0].innerHTML = image_list;
            $(".image-title-list").click(function(){
                console.log($(this));
                console.log($(this)[0].src);

                $('#copy_text')[0].innerHTML = "![](" + $(this)[0].src + ")";
                copyToClipboard(document.getElementById("copy_text"));
            });
            $('#recent-article-modal').modal();
        }
    }
    function showRewcentImage(data){
        console.log(data);
        $('#atc-img-switch').bootstrapSwitch('setState', false);
        showRecent();
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $("#input-text-area").scroll(function(){
        var input_dom = document.getElementById("input-text-area"),
            total_height = input_dom.scrollHeight - input_dom.offsetHeight,
            scroll_height = input_dom.scrollTop;

        pos = scroll_height / total_height;
        var content = document.getElementById("content-area"),
            pos = (content.scrollHeight - content.offsetHeight)*pos;
        $("#content-area").stop();
        $("#content-area").animate({scrollTop: pos}, 250);
    })
    $("#file-upload-btn").click(function(){
        $("#file-input").trigger("click");
    });
    oldFileVal = "";
    oldDragFileVal = "";
    $("#file-input").change(function(){
        var fileInput = $("#file-input").val();
        if (fileInput && fileInput != oldFileVal){
            oldFileVal = fileInput;
            var data = new FormData($("#upload-file-form")[0]);
            data.set("act", "upload_file");
            $.ajax({
                url: "/blog/api/",
                type: "post",
                data: data,
                cache: false,
                processData: false,
                contentType: false,
                success:function(data){
                    console.log(data);
                    showRewcentImage(data);
                },
                error:function(e){
                    console.log(e);
                }
            });
        }
    });
    $("#save-btn").click(function(){
        setSaveButton("saving");

        var data = new FormData($("#upload-file-form")[0]);
        data.set("file", null);
        data.set("content", $("#input-text-area").val());
        data.set("html", $("#content-area")[0].innerHTML);
        $.ajax({
            url: "/blog/write/",
            type: "post",
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            success:function(data){
                var data = JSON.parse(data);
                if((data["err"] == 0) || data["err"] == "no_content"){
                    setSaveButton("saved");
                    setTimeout(function(){
                        setSaveButton("save");
                    }, 1000)
                }else if(data["err"] == "need_login"){
                    setSaveButton("save");
                    $('#reg-prompt')[0].innerHTML = "* 注册或登录";
                    $('#login-modal').modal();
                }
            },
            error:function(e){
                setSaveButton("save");
            }
        });
    });
    $(".redinput").on('input', function(){
        var email = $("#login-email").val(),
            password = $("#login-password").val(),
            email_re = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,10}$/;

        if ((password.length < 6) || (!email_re.test(email))) {
            $("#login-btn").removeClass("light");
            $('#login-btn').unbind("click");
            $("#login-btn").removeAttr("data-dismiss");
            return;
        }

        $("#login-btn").addClass("light");
        $('#login-btn').unbind("click");
        $("#login-btn").attr("data-dismiss", "modal")

        $("#login-btn").click(function(){
            var data = new FormData($("#upload-file-form")[0]);
            data.set("file", null);
            data.set("email", email);
            data.set("password", password);
            setTimeout(function(){
                $.ajax({
                    url: "/blog/reg/",
                    type: "post",
                    data: data,
                    cache: false,
                    processData: false,
                    contentType: false,
                    success:function(data){
                        regitProcess(JSON.parse(data));
                    },
                    error:function(e){
                        console.log(e);
                    }
                });
            }, 400);
        });
    });
    $(document).on('keydown', '', function(e){
        if(window.event.keyCode == 9){
            if($("#input-text-area").is(":focus")){
                event.preventDefault();
                insertStr("\t");
            }
            return ;
        }
        if(event.ctrlKey  &&  window.event.keyCode==83 ){
            event.preventDefault();
            $("#save-btn").trigger("click");
        }
        return;
    })
    $(window).resize(windowSizeConf);
    $(document).on({
        dragleave:function(e){
            e.preventDefault();
        },
        drop:function(e){
            e.preventDefault();
        },
        dragenter:function(e){
            e.preventDefault();
        },
        dragover:function(e){
            e.preventDefault();
        }
    });
    var box = document.getElementById('input-area');
    box.addEventListener("drop", function(e){
        console.log("e: ", e)
        e.preventDefault();
        var fileList = e.dataTransfer.files;
        if(fileList.length == 0){
            return false;
        }
        if(fileList[0].type.indexOf('image') === -1){
            console.log("您拖的不是图片！");
            return false;
        }
        var filename = fileList[0].name;
        var filesize = Math.floor((fileList[0].size)/1024);
        if(filesize>1500){
            console.log("上传大小不能超过1500K.");
            return false;
        }
        console.log("fileList[0]:", fileList[0])

        var data = new FormData($("#upload-file-form")[0]);
        data.set("file", fileList[0]);
        data.set("act", "upload_file");
        $.ajax({
            url: "/blog/api/",
            type: "post",
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            success:function(data){
                console.log(data);
                showRewcentImage(data);
            },
            error:function(e){
                console.log(e);
            }
        });
    },false);
    $('#atc-img-switch').on('switch-change', function (e, data) {
        var value = data.value;
        console.log(value);
        if(value){
            $('#image-list').fadeOut(0);
            $('#content-list').fadeIn();
        }else{
            $('#content-list').fadeOut(0);
            $('#image-list').fadeIn();
        }
    });
    function copyToClipboard(elem) {
        // create hidden text element, if it doesn't already exist
        var targetId = "_hiddenCopyText_";
        var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
        var origSelectionStart, origSelectionEnd;
        if (isInput) {
            // can just use the original source element for the selection and copy
            target = elem;
            origSelectionStart = elem.selectionStart;
            origSelectionEnd = elem.selectionEnd;
        } else {
            // must use a temporary form element for the selection and copy
            target = document.getElementById(targetId);
            if (!target) {
                var target = document.createElement("textarea");
                target.style.position = "absolute";
                target.style.left = "-9999px";
                target.style.top = "0";
                target.id = targetId;
                document.body.appendChild(target);
            }
            target.textContent = elem.textContent;
        }
        // select the content
        var currentFocus = document.activeElement;
        target.focus();
        target.setSelectionRange(0, target.value.length);

        // copy the selection
        var succeed;
        try {
            succeed = document.execCommand("copy");
        } catch(e) {
            succeed = false;
        }
        // restore original focus
        if (currentFocus && typeof currentFocus.focus === "function") {
            currentFocus.focus();
        }

        if (isInput) {
            // restore prior selection
            elem.setSelectionRange(origSelectionStart, origSelectionEnd);
        } else {
            // clear temporary content
            target.textContent = "";
        }
        return succeed;
    }
})

