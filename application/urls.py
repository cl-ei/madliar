from application.blog.urls import url as blog_url_map
from application.blog.views import home_page, favicon_response, record
from application.api.views import handler, route_parser
from application.music.urls import url as music_url_map


url = {
    "^/$": home_page,
    "^/favicon.ico/?$": favicon_response,
    "^/blog": blog_url_map,
    "^/record/?$": record,
    "^/api/?$": handler,
    "^/api/(\d+)/?$": route_parser,
    "^/music": music_url_map,
}
