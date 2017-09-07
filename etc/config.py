import os


__all__ = (
    "DEBUG",
    "LOG_PATH",
    "PROJECT_ROOT",
    "MUSIC_FOLDER",
    "POST_ARTICLE_PATH",
    "PARSED_ARTICLE_JSON",
    "STATICS_URL_MAP",
    "REDIS_CONFIG",
    "APP_NOTE_BOOK_CONFIG",
    "EMAIL_CONFIG",
)

if os.name in ("nt", ):
    DEBUG = True
    LOG_PATH = "."
    PROJECT_ROOT = "./"
else:
    DEBUG = False
    LOG_PATH = "/home/wwwroot/log"
    PROJECT_ROOT = "/home/wwwroot/madliar"

MUSIC_FOLDER = "./music/"
POST_ARTICLE_PATH = "template/_post/article"
PARSED_ARTICLE_JSON = "static/blog/js/article"

STATICS_URL_MAP = {
    "^/statics": "application/blog/static",
    "^/static": "static",
    "^/music_file": "music",
}

REDIS_CONFIG = {
    
}

APP_NOTE_BOOK_CONFIG = {
    "user_root_foler": "/home/wwwroot/notebook"
}

EMAIL_CONFIG = {
    "mail_host": 'smtp.caoliang.net',
    "mail_user": 'i@caoliang.net',
    "mail_pass": '000000',
    "sender": 'i@caoliang.net',
}
