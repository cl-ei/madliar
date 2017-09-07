import re

from importlib import import_module
from wsgiref.simple_server import make_server
from wsgiserver.response import static_files_response, Http404Response
from wsgiserver.request import WSGIRequest
from etc.config import DEBUG, STATICS_URL_MAP, CUSTEM_MIDDLEWARE
from application.urls import url as user_url_map


def dynamic_import_class(dotted_path):
    """
    Import a dotted module path and return the attribute/class designated by the
    last name in the path. Raise ImportError if the import failed.
    """
    try:
        module_path, class_name = dotted_path.rsplit('.', 1)
    except ValueError:
        raise ImportError("%s doesn't look like a module path" % dotted_path)

    dynamic_imported_module = import_module(module_path)

    try:
        return getattr(dynamic_imported_module, class_name)
    except AttributeError:
        raise ImportError(
            """Module "%s" does not define a "%s" attribute/class"""
            % (module_path, class_name)
        )


class BaseMiddleware(object):
    def __init__(self, get_response):
        # One-time configuration and initialization.
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response


class BaseHandler(object):
    def __init__(self, *args, **kwargs):
        pass


class WSGIHandler(BaseHandler):
    request_class = WSGIRequest

    def __init__(self, *args, **kwargs):
        super(WSGIHandler, self).__init__(*args, **kwargs)
        self._handler = None

    def __call__(self, environ, start_response):
        request = self.request_class(environ)
        response = self.get_response(request)

        response._handler_class = self.__class__

        status = '%d %s' % (response.status_code, response.reason_phrase)
        start_response(str(status), response.headers.items())

        if getattr(response, 'file_to_stream', None) is not None and environ.get('wsgi.file_wrapper'):
            response = environ['wsgi.file_wrapper'](response.file_to_stream)
        return response

    def _load_middleware(self, request):
        middleware_classes = [dynamic_import_class(_) for _ in CUSTEM_MIDDLEWARE]
        pass

    def route_distributing(self, request, url_map=user_url_map):
        for url, view_func in url_map.items():
            m = re.match(url, request.route_path)
            if m:
                if isinstance(view_func, dict):
                    request.route_path = request.route_path[len(m.group()):] or "/"
                    return self.route_distributing(request, url_map=view_func)
                else:
                    return view_func(request, *m.groups())
        # Not hit
        if DEBUG:
            for url, static_path in STATICS_URL_MAP.items():
                m = re.match(url, request.path_info)
                if m:
                    request.route_path = request.path_info[len(m.group()):] or "/"
                    return static_files_response(request, static_path)
        return Http404Response()

    def get_response(self, request):
        self._load_middleware(request)
        return self.route_distributing(request)


def get_application():
    return WSGIHandler()


def wsgi_server(host, port):
    """Start a simple server."""
    return make_server(host, port, get_application())
