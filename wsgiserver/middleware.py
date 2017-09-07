"""
Base middleware

"""


class BaseMiddleware(object):
    def __init__(self, get_response):
        # One-time configuration and initialization.
        self.get_response = get_response

    def __call__(self, request):
        print request
        response = self.get_response(request)
        print response
        return response
