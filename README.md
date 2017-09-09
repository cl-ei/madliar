## __MADLIAR__

  A tiny WSGI web framework. The madliar website (https://www.madliar.com/)
is base on this framework.

## __Features__

*  router
* request and response
* template engine
* wsgi server
* custom middleware

## __Install__
```
    pip install madliar
    madliar-manage  # show help text.
```

## __Getting Started__

Just run ```madliar-manage runserver localhost:8080```, and you will see "It works !" if you visit http://localhost:8080.

Now create a web project, run `madliar-manage create_proj [your project name]` command then it will auto-generate some code that establishes a web project. Two folders will be created, one named `management` is used to collection of settings and anothor folder named `application`  you can put your business code in it.

For example, run the following command to build a "Hello world !" website:
```
madliar-manage create_proj hello_world
cd hello_world
madliar-manage runserver localhost:8080

# You will see "Hello world !" in your browser !
```

Let’s look at what created:
```
.
├── hello_world
│   ├── application
│   │   ├── __init__.py
│   │   └── urls.py
│   ├── management
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── madliar_uwsgi_socket.xml
│   │   └── wsgi.py
│   └── README.rst
```
You cannot rename the `application` and `management` directory because madliar find your current project package though it's name when you running `madliar-manage runserver` command.

Let's look at the `urls.py` file:
```
from madliar.http.response import HttpResponse

# The `hello_world` function is just used to show you how to start an application,
# you may need remove it and build your own url map later.
def hello_world(request):
    return HttpResponse("Hello world !")

url = {
    "/": hello_world,

}
```
So, when a madliar server started, it will look up the `urls.py` to find out the url map, and decide which function is to call when a request come. The url map is supporting nestification, for example, you can make a directory `blog` under `application` to collect you single application "blog",  and use "/blog" prefix point  to the app, you can do like this:

```
.
├── hello_world
│   ├── application
│   │   ├── __init__.py
│   │   ├── urls.py
│   │   └── blog
│   │       ├── __init__.py
│   │       └── urls.py

```
In  `application/ urls.py`:
```
from .blog.urls import url as blog_url

url = {
    "/blog": blog_url,

}
```
And now you can write your views in blog directory the way just like  the default-created file `urls.py` showed.

## __Feedback and Opinions__

This is one of my amateur projects, Thanks for checking it out. If you havs any questions or opinions, welcome to send me an e-mail(i@caoliang.net).