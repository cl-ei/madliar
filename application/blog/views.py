from wsgiserver.template import render
from wsgiserver.middleware import HttpResponse


def home_page(request):
    return render("template/home_page.html", {})
