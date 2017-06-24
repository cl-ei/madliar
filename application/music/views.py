import os
from wsgiserver.http import HttpResponse
from wsgiserver.template import render
from etc.config import MUSIC_FOLDER


def handler(request):
    if request.GET.get("ref"):
        view_data = {
            "ref": True,
            "music_list": os.listdir(MUSIC_FOLDER)
        }
    else:
        view_data = {"ref": False}

    return render(
        "template/music/index.html",
        context=view_data
    )
