# -*- coding:utf-8 -*-
import sys
import os
import re
import json
from etc.config import DEBUG, PROJECT_ROOT, POST_ARTICLE_PATH, PARSED_ARTICLE_PATH, PARSED_ARTICLE_INDEX_PATH


class ArticleParser(object):
    def __init__(self, *args, **kwargs):
        self.name = kwargs.get("file_name") or args[0]
        self.path = kwargs.get("file_path") or args[1]
        self.create_time = map(int, self.name.split("-")[:3])

        self.id = 0
        for index, num in enumerate(self.create_time[::-1]):
            self.id += 100**index * num

        with open(os.path.join(self.path, self.name), "r") as f:
            content = f.read()
        self.content = content if isinstance(content, unicode) else content.decode("utf-8")

        self.header = None
        self.header_style_pattern = re.compile(r"(\w+)\s*:\s*(.*)")

        self.header_info = {}
        self.body = ""

    def __split_article_header_content(self):
        m = re.match(r"^-{3,}([\s\S]*)", self.content)
        if m:
            content = m.groups()[0]
            self.header, self.body = re.split(r"-{3,}\n", content, maxsplit=1)

    def __parse_header(self):
        for line in self.header.split("\n"):
            line = line.replace(u'　', ":", 1).replace("\r", "")
            match = self.header_style_pattern.match(line)
            if match:
                k, v = match.groups()
                if k in ["tag", "tags"]:
                    k = "tags"
                    v = [tag.strip(" \r\n") for tag in v.replace(u'，', ",").split(",")]
                else:
                    v = v.strip(" \r\n")
                self.header_info.update({k: v})

    def __parse_body(self):
        preview = self.body.split("<!--more-->")[0]
        self.header_info["preview"] = preview

        m = re.match(r"<img\s*src=([^\s]+).*>?", self.body)
        if m:
            first_figure = m.groups()[0].strip("'\"")
        else:
            first_figure = "/static/blog/img/blog/20170127/0.jpg"
        self.header_info["first_figure"] = first_figure

    @property
    def article_info(self):
        self.__split_article_header_content()
        self.__parse_header()
        self.__parse_body()

        article_info = {
            "create_time": u"%s年%s月%s日" % tuple(self.create_time),
            "id": self.id,
            "content": self.body
        }
        article_info.update(self.header_info)

        for k, v in article_info.items():
            if isinstance(v, str):
                article_info[k] = v.decode("utf-8")

        return article_info


def generate_cached_article_json(*args, **kwargs):
    sys.stdout.write("Start load article.\n")

    article_path = os.path.join(PROJECT_ROOT, POST_ARTICLE_PATH)
    file_list = os.listdir(article_path)

    for file_name in file_list:
        parser = ArticleParser(file_name=file_name, file_path=article_path)
        content = json.dumps(
            parser.article_info,  # every key/value must be unicode
            ensure_ascii=False,
            indent=4 if DEBUG else None,
        )
        with open(os.path.join(PARSED_ARTICLE_PATH, str(parser.id)), "w") as f:
            f.write(content.encode("utf-8"))

    articles = sorted(map(int, os.listdir(PARSED_ARTICLE_PATH)))
    articles.reverse()

    index_info = []
    for article in articles[:10]:
        with open(os.path.join(PARSED_ARTICLE_PATH, str(article))) as f:
            article_info = json.loads(f.read())

        _ = {}
        for k in ["id", "title", "tags", "create_time", "first_figure", "preview"]:
            _[k] = article_info[k] if k in article_info else None
        index_info.append(_)

    index_json = json.dumps(index_info, ensure_ascii=False, indent=4 if DEBUG else None)
    with open(os.path.join(PARSED_ARTICLE_INDEX_PATH, "index.json"), "w") as f:
        f.write(index_json.encode("utf-8"))
    return True
