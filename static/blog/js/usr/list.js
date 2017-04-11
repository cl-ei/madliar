$(function(){
	var post_tags = [];
	var post_tags_count = {};

	var article_list = $(".list-post")
    for (var i in article_list){
        var tags = article_list.eq(i).attr("tags") || "";
        tags = tags.split(" ");
        for (var j in tags){
            if (tags[j].length){
                var count = post_tags_count[tags[j]] || 0;
                post_tags_count[tags[j]] = count + 1;
                if (post_tags.indexOf(tags[j]) < 0){
                    post_tags.push(tags[j]);
                }
            }
        }
    }

    $('<botton />', {
    	html: "全部 "+ $(".list-post").length,
    	class: "tag_btn",
    	type: "button",
    	id: "show-all-btn"
    }).appendTo($('#tags_border'));

    for (var i = 0; i < post_tags.length; i++){
        $('<botton />', {
                html: post_tags[i] + " " + post_tags_count[post_tags[i]],
                class: "tag_btn select-tag",
                type: "button",
                tag: post_tags[i],
        }).appendTo($('#tags_border'));
    }
    function set_year_display(){
        var al_year = $(".al_year"),
            list = $(".list-post:visible"),
            years = [];

        for (var i = 0; i < list.length; i++){
            years.push(list.eq(i).attr("year"));
        }

        al_year.fadeOut(0);
        if(document.body.scrollWidth > 680){
            for (var i = 0; i < al_year.length; i++){
                if (years.indexOf(al_year[i].innerHTML) > -1){
                    al_year.eq(i).fadeIn(100);
                }
            }
        }
    }
    $("#show-all-btn").click(function(){
        $(".list-post").fadeIn(300);
        if(document.body.scrollWidth > 680){
            $(".al_year").fadeIn(300);
        }
    });
    $(".select-tag").click(function(){
        var tag = $(this).eq(0).attr("tag");
        for (var i in article_list){
            var sel_tag = article_list.eq(i).attr("tags") || "";
            sel_tag = sel_tag.split(" ");

            if (sel_tag.indexOf(tag) > -1){
                article_list.eq(i).fadeIn(300);
            }else{
                article_list.eq(i).fadeOut(0);
            }
        }
        set_year_display();
    });
    $("#sel-biji").click(function(){
        $(".list-post[category='观点']").fadeOut(0);
        $(".list-post[category='学习笔记']").fadeIn(100);
        set_year_display();
    });
    $("#sel-guandian").click(function(){
        $(".list-post[category='学习笔记']").fadeOut(0);
        $(".list-post[category='观点']").fadeIn(100);
        set_year_display();
    });
    $("#sel-guandian").trigger("click");
});
