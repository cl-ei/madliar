from application.blog.urls import url as blog_url_map
from application.blog.views import home_page

url = {
    "^/$": home_page,
    "^/blog": blog_url_map,
}
