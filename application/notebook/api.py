# -*- coding:utf-8 -*-
import json
import re
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
    password = request.POST.get("password", "")
    email_pattern = re.compile(r"^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$")
    if not email_pattern.match(email):
        response = {
            "err_code": 403,
            "err_msg": u"错误的邮箱。"
        }
        return HttpResponse(json.dumps(response), content_type="application/json")

    if not 5 < len(password) < 48:
        response = {
            "err_code": 403,
            "err_msg": u"密码过长或过短。"
        }
        return HttpResponse(json.dumps(response), content_type="application/json")

    result, token = dao.login(email=email, password=password)
    response = {
        "err_code": 0 if isinstance(token, (str, unicode)) and len(token) == 64 else 403,
        "token" if result else "err_msg": token,
        "email": email,
    }
    return HttpResponse(json.dumps(response), content_type="application/json")


@supported_action(action="regist")
def regist(request):
    email = request.POST.get("email")
    password = request.POST.get("password", "")
    email_pattern = re.compile(r"^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$")
    if not email_pattern.match(email):
        response = {
            "err_code": 403,
            "err_msg": u"错误的邮箱。"
        }
        return HttpResponse(json.dumps(response), content_type="application/json")

    if not 5 < len(password) < 48:
        response = {
            "err_code": 403,
            "err_msg": u"密码过长或过短。"
        }
        return HttpResponse(json.dumps(response), content_type="application/json")

    result, token = dao.regist(email, password)
    response = {
        "err_code": 0 if isinstance(token, (str, unicode)) and len(token) == 64 else 403,
        "token" if result else "err_msg": token,
        "email": email,
    }
    return HttpResponse(json.dumps(response), content_type="application/json")


@supported_action(action="logout")
def logout(request):
    email = request.COOKIES.get("email")
    if email:
        dao.logout(email)
    return HttpResponse(json.dumps({"err_code": 0}), content_type="application/json")


def login_required(func):
    def wraped_func(*args, **kwargs):
        request = args[0] or kwargs.get("request")
        if not request:
            raise TypeError("Error param request: %s." % request)
        mad_token = request.COOKIES.get("madToken")
        email = request.COOKIES.get("email")

        result = dao.check_login(email, mad_token)
        if not result:
            response = {"err_code": 403, "err_msg": u"您的认证已经过期，请重新登录。"}
            return HttpResponse(json.dumps(response), content_type="application/json")
        return func(*args, **kwargs)
    return wraped_func


@supported_action(action="get_file_list")
@login_required
def get_file_list(request):
    response = {"err_code": 0, "data": "ok"}
    return HttpResponse(json.dumps(response), content_type="application/json")
