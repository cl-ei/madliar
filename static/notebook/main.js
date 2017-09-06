$.cl = {
    setCookie: function (key, value, expiredays){
        var exdate=new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = key + "=" + encodeURI(value)
            + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
    },
    getCookie: function (key) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                 var cookie = jQuery.trim(cookies[i]);
                 if (cookie.substring(0, key.length + 1) == (key + '=')) {
                     cookieValue = decodeURIComponent(cookie.substring(key.length + 1));
                     break;
                 }
             }
        }
        return cookieValue;
    },
    windowSizeMonitor: function (){
        if(document.documentElement.clientWidth < 605){
            $("#nav, #content").css({"display": "none"});
            $("#uavaliable-mask").css({"display": "block"});
        }else{
            $("#nav, #content").css({"display": "block"});
            $("#uavaliable-mask").css({"display": "none"});
        }
    },
    popupMessage: function (msg, title){
        var promptModal = $(".cl-prompt");
        if(promptModal.css("opacity") > 0){
            $.cl.clearMessage();
            setTimeout(function(){
                $.cl.popupMessage(msg, title)
            }, 200);
        }else{
            $("#cl-prompt-title").html(title || "提示");
            $("#cl-prompt-content").html(msg);
            promptModal.css({"opacity": "1", "top": "20px", "z-index": "10"}).children().eq(0).off("click").click($.cl.clearMessage);
        }
    },
    clearMessage: function (){
        $(".cl-prompt").css({"opacity": "0", "top": "0px", "z-index": "-10"});
    },
    onLoginOrRegisted: function (data){
        if(data.err_code != 0){
            var msg = "操作失败。详细信息：" + data.err_msg;
            $.cl.popupMessage(msg);
            return ;
        }
        $.cl.setCookie("madToken", data.token);
        $.cl.setCookie("email", data.email);
        $.cl.contextData.loginInfo = {
            email: data.email
        };
        $.cl.renderLoginPage();
    },
    login: function (){
        var email = $("input[name=email]").val(),
            password = $("input[name=password]").val();
        if(email.length < 1 || password.length > 32 || password.length < 5){
            $.cl.popupMessage("请输入正确的邮箱和密码。");
            return ;
        }
        $.ajax({
            url: "/notebook/api",
            type: "post",
            data: {
                action: "login",
                email: email,
                password: password
            },
            success: $.cl.onLoginOrRegisted,
            error: function(e){
                $.cl.popupMessage("操作失败，请检查你的网络连接。");
            }
        })
    },
    logout: function (){
        $.ajax({
            url: "/notebook/api",
            type: "post",
            data: {
                action: "logout"
            },
            success: function(data){
                if(data.err_code != 0){
                    var msg = "操作失败。详细信息：" + data.err_msg;
                    $.cl.popupMessage(msg);
                    return ;
                }
                $.cl.contextData.loginInfo = false;
                $.cl.renderUnloginPage();
            },
            error: function(e){
                $.cl.popupMessage("操作失败，请检查你的网络连接。");
            }
        })
    },
    regist: function (){
        var email = $("input[name=email]").val(),
            password = $("input[name=password]").val();
        if(email.length < 1 || password.length > 32 || password.length < 5){
            $.cl.popupMessage("请输入正确的邮箱和密码。");
            return ;
        }
        $.ajax({
            url: "/notebook/api",
            type: "post",
            data: {
                action: "regist",
                email: email,
                password: password
            },
            success: $.cl.onLoginOrRegisted,
            error: function(e){
                $.cl.popupMessage("操作失败，请检查你的网络连接。");
            }
        })
    },
    renderLoginPage: function (){
        $.cl.releasePageResource();
        var navHtml = [
            '<span class="user-name">欢迎回来，' + $.cl.contextData.loginInfo.email + '</span>',
            '<a href="javascript:void(0)" id="logout" ><i class="fa fa-sign-in" aria-hidden="true"></i> 注销</a>'
        ].join("");
        $(".right-nav").html(navHtml);
        $("#logout").click($.cl.logout);

        var leftNavHtml = [
            '<a href="javascript:void(0)" id="save-btn"><i class="fa fa-save" aria-hidden="true"></i> 保存</a>'
        ].join("");
        $("#top-dynamic-nav").html(leftNavHtml);
    },
    releasePageResource: function (){

    },
    renderUnloginPage: function (){
        $.cl.releasePageResource();
        var navHtml = [
            '<a href="javascript:void(0)" id="login" ><i class="fa fa-sign-in" aria-hidden="true"></i> 登录</a>',
            '<a href="javascript:void(0)" id="register" ><i class="fa fa-table" aria-hidden="true"></i> 注册</a>'
        ].join("");
        $(".right-nav").html(navHtml);
        $("#login").click(function(){
            $("#login-or-regist").html("登录");
            $("#login-modal").modal("show");
        }).next().click(function(){
            $("#login-or-regist").html("注册");
            $("#login-modal").modal("show");
        });
        $("#login-btn").click(function(){
            $("#login-modal").modal("hide");
            return $("#login-or-regist").html() === "注册" ? $.cl.regist() : $.cl.login();
        })
    }
};