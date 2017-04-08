from wsgiserver.template import render


def home_page(request):
    return render("template/home_page.html")
