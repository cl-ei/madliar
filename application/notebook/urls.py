from .views import handler
from .api import handler as api_handler


url = {
    "/?$": handler,
    "/api/?$": api_handler,
}
