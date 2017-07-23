import os
import json
from wsgiserver.template import render


def handler(request):
    context = {}
    return render(
        "template/notebook/index.html",
        context=context
    )
