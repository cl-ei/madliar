import json
from wsgiserver.http import HttpResponse


class supported_action(object):
    ActionDoesNotExisted = type("supported_action__ActionDoesNotExisted", (Exception, ), {})
    __function = {}

    def __init__(self, action):
        self.__action = action

    def __call__(self, func):
        self.__class__.__function[self.__action] = func
        return func

    @classmethod
    def run(cls, action, *args, **kwargs):
        picked_func = cls.__function.get(action)
        if callable(picked_func):
            return picked_func(*args, **kwargs)
        else:
            raise cls.ActionDoesNotExisted


def handler(request):
    if request.method.lower() != "post":
        return HttpResponse(
            json.dumps({"err_code": 403, "err_msg": "Only POST method supported."}),
            content_type="application/json"
        )

    action = request.POST.get("action")
    try:
        return supported_action.run(action, request)
    except supported_action.ActionDoesNotExisted:
        return HttpResponse(
            json.dumps({"err_code": 404, "err_msg": "Action(%s) is not supported." % action}),
            content_type="application/json"
        )
