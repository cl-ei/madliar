from wsgiserver.template import render
from wsgiserver.http import HttpResponse


def favicon_response(request):
    with open("static/img/favicon.png", "rb") as f:
        content = f.read()
    return HttpResponse(content, content_type="image/x-icon")


def home_page(request):
    return render("template/home_page.html")
