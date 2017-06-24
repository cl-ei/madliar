# -*- coding:utf-8 -*-
import json
from wsgiserver.http import HttpResponse
import requests
import os

search_url = "http://s.music.163.com/search/get/?type=1&limit=5&s=%s-%s"
run_chrome = "\"C:\Program Files (x86)\Google\Chrome\Application\cl.exe\" %s"
close_chrome = "taskkill /f /im \"cl.exe\""


def handler(request):
    if request.GET.get("get"):
        song = request.GET.get("song")
        singer = request.GET.get("singer")
        song_info = get_song_id_and_singer(song, singer)
        if song_info.get("error"):
            return HttpResponse("Not found.", status_code=404)
        music_url = get_music_download_url(song_info.get("id", 0))
        if music_url:
            song_info["music_url"] = music_url
            return HttpResponse(json.dumps(song_info, ensure_ascii=False))
        else:
            return HttpResponse("Not found.", status_code=404)

    else:
        url = request.path[5:]
        with open("url.txt", "w") as f:
            f.write(url)
        # os.system(close_chrome)
        return HttpResponse("Closed")


def get_song_id_and_singer(song_name, singer=None):
    url = "http://music.163.com/api/search/get/"
    cookie = {"appver": "2.0.2"}
    data = {
        "s": "%s-%s" % (song_name, singer) if singer else song_name,
        "limit": 20,
        "type": 1,
        "offset": 0,
    }
    r = requests.post(url=url, data=data, cookies=cookie)
    if r.status_code == 200:
        result = r.content
    else:
        return {"error": "status code is not 200."}

    result_dict = json.loads(result).get("result", {})
    try:
        song = result_dict.get("songs", [{}])[0]
    except Exception as e:
        return {"error": e}

    return_data = {
        "id": song.get("id", 0),
        "name": song.get("name", ""),
        "singer": song.get("artists", [{}])[0].get("name", "")
    }
    return return_data


def get_music_download_url(song_id):
    url = "http://music.163.com/#/song?id=%s" % song_id
    command = run_chrome % url
    print command
    os.system(command)
    try:
        with open("url.txt") as f:
            url = f.read()
        os.system("rm -rf url.txt")
        return url
    except IOError:
        return ""


def route_parser(request, *args, **kwargs):
    print "get -> ", args, kwargs
    return HttpResponse("OK")
