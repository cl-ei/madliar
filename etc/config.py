__all__ = (
    "DEBUG",
    "STATICS_URL_MAP",
    "POST_ARTICLE_PATH",
    "PARSED_ARTICLE_PATH",
    "PARSED_ARTICLE_INDEX_PATH",
)

# email config
mail_host = 'smtp.caoliang.net'
mail_user = 'i@caoliang.net'
mail_pass = '000000'
sender = 'i@caoliang.net'

DEBUG = True

STATICS_URL_MAP = {
    "^/statics": "application/blog/static",
    "^/static": "static",
}

PROJECT_ROOT = "./" if DEBUG else "/home/wwwroot/localprj"
POST_ARTICLE_PATH = "template/_post/article"
PARSED_ARTICLE_PATH = "template/_post/json"
PARSED_ARTICLE_INDEX_PATH = "template/_post"

