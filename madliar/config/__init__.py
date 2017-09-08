"""
Settings and configuration for madliar.

"""

import os

#
# class SettingsLoader(type):
#     def __new__(mcs, *args):
#         name, bases, namespace = args[:]
#         print "SettingsLoader: ", name, bases, namespace
#         namespace["__slots__"] = ("PWD", )
#         return type.__new__(mcs, name, bases, namespace)
#
#
# class A(object):
#     __metaclass__ = SettingsLoader
#
#     def __init__(self):
#         self.DEBUG = "DEBUG"
#         self.__class__.__setattr__ = lambda i, k, v: 0
#
#
# class SettingsBuilder(object):
#     def __init__(self):
#         self.PWD = os.environ.get("PWD")
#
#         def write_forbidden(*args, **kwargs):
#             raise TypeError("Cannot Set.")
#
#         self.__class__.__setattr__ = write_forbidden
#
#
# settings = SettingsLoader()
