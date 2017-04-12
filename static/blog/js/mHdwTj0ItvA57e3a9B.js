function clearTitleLoadingPrompt(){
    $("#madliar-title").css({top: "140px", "opacity": 0});
}
function loadArticle(){
    clearTitleLoadingPrompt();
    $("#home-sub-page").fadeIn(300).next().fadeOut(0);
}
function startFlushBackgroundImage(){
    window.backgroundImageIndex = 0;
    window.backgroundImageFlushInterVal = 0;
    var speedIntVal = 6000;

    window.backgroundImageFlushInterVal = setInterval(function(){
        if(window.backgroundImageIndex == 0){
            $("#mask").css({transition: "opacity 3s", opacity: 0});
        }
        window.backgroundImageIndex += 1;
        var currentIndex = parseInt(window.backgroundImageIndex % 4);
        for (var i = 0; i < 4; i++){
            $(".sub-mask").eq(i).css("opacity", i == currentIndex ? "1" : "0" );
        }
    }, speedIntVal);
}
function onFirstBackgroundImageLoad(){
    $("#mask").css({
        "opacity": 1,
        "background-image": 'url("/static/img/slider0.jpg")'
    });
    startFlushBackgroundImage();
    loadArticle();
}
function initialization(){
    $('<img src="/static/img/slider0.jpg" onload="onFirstBackgroundImageLoad()">').appendTo($("#hidden-area"));
    for (var i = 0; i < 4; i ++) {
        $('<div class="sub-mask" style="background-image: url(/static/img/slider' + i + '.jpg)">').appendTo($("body"));
    }
}
function renderHomePage(){
    var homePageArticleBoxHtml = "";
    for (var i = 0; i < 10; i ++){
        var article = window.articleList[window.articleIdList[i]];
        var articleBox = [
            '<div class="blog-box-container animated fadeInDownSlow">',
                '<div class="blog-timeline-box">',
                    '<div class="blog-timeline-wrapper">',
                        '<div class="blog-timeline-spin">',
                            '<img src="/static/img/hex.png">',
                        '</div>',
                        '<div class="blog-timeline-time">' + article.create_time + '</div>',
                    '</div>',
                '</div>',
                '<div class="blog-concise-box">',
                    '<div class="blog-concise">',
                        '<div class="blog-concise-title">',
                            '<a data-id="' + article.id + '">' + article.title + '</a>',
                        '</div>',
                        '<div class="blog-concise-preimg">',
                            '<img src="' + article.first_figure + '">',
                        '</div>',
                        '<div class="blog-concise-content">' + marked(article.preview) + '</div>',
                        '<a class="read-more" data-id="' + article.id + '">继续阅读 >></a>',
                    '</div>',
                '</div>',
            '</div>'
        ];
        homePageArticleBoxHtml += articleBox.join("");
    }
    $("#home-sub-page").html(homePageArticleBoxHtml);
    $(".blog-concise-title a, .read-more").click(function(){
        articleReadingView($(this).data("id"));
    })
}
function articleReadingView(article_id){
    var article = window.articleList[article_id],
        article_index = window.articleIdList.indexOf(article_id),
        next = "",
        prev = "";

    if(article_index > 0){
        var next_id = window.articleIdList[article_index - 1];
        var next_title = window.articleList[next_id].title;
        next = ""
            + '<div class="article-nav-next">'
            + '下一篇：<a class="next-article-btn" data-id="' + next_id + '">' + next_title + '</a>'
            + '</div>';
    }
    if(article_index < window.articleIdList.length - 1){
        var prev_id = window.articleIdList[article_index + 1];
        var prev_title = window.articleList[prev_id].title;
        prev = ""
            + '<div class="article-nav-prev">'
            + '上一篇：<a class="prev-article-btn" data-id="' + prev_id + '">' + prev_title + '</a>'
            + '</div>';
    }

    var detailHtml = [
        '<div class="detail-container animated fadeInDownSlow">',
            '<div class="detail-paper">',
                '<div class="detail-header">',
                    '<div class="detail-article-close">X</div>',
                    '<div class="detail-article-return">←</div>',
                    '<div class="detail-article-title">' + article.title + '</div>',
                '</div>',
                '<div class="detail-content">' + marked(article.content) + '</div>',
                '<div class="detail-footer">版权所有，请勿侵权。作者：' + (article.author || "CL") + '，最后更新于' + article.create_time + '</div>',
                next + prev,
                '<div class="m-comment">',
                    '想要添加评论？',
                    '<a href="mailto:i@caoliang.net?subject=评论《'+ article.title +'》">点击此处</a>给作者发送邮件',
                '</div>',
            '</div>',
        '</div>'
    ];
    $("section").children().fadeOut(0);
    $("#detail-sub-page").html(detailHtml.join("")).fadeIn(300);
    document.body.scrollTop = 0;
    $(".detail-article-return, .detail-article-close").click(function(){
        $("section").children().fadeOut(200);
        $("#home-sub-page").fadeIn(0);
    });
    $(".next-article-btn, .prev-article-btn").click(function(){
        articleReadingView($(this).data("id"));})
}
$(function(){
    $(".logo").shuffleLetters();
    renderHomePage();
    initialization();
    $("#about-view").click(function(){
        clearTitleLoadingPrompt();
        $("#home-sub-page").fadeOut(0);
        $("#about-sub-page").fadeIn(400);
        document.body.scrollTop = 0;
    });
    $("#home-view").click(function(){
        $("#about-sub-page").fadeOut(0);
        $("#home-sub-page").fadeIn(0);
    });
    $(".navi a").click(function(e) {
        if($(this).hasClass("current")) {
            $(this).removeClass("current");
        } else {
        $(".navi a").removeClass("current");
            $(this).addClass("current");
        }
   });
});