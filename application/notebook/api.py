import json
from wsgiserver.http import HttpResponse
from application.notebook import dao


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


@supported_action(action="login")
def login(request):
    email = request.POST.get("email")
    password = request.POST.get("password")
    # TODO: check

    result, token = dao.login(email=email, password=password)
    response = {
        "err_code": 0 if isinstance(token, (str, unicode)) and len(token) == 64 else 403,
        "token" if result else "err_msg": token
    }

    return HttpResponse(json.dumps(response), content_type="application/json")
