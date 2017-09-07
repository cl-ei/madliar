"""
This module contains generic exceptions used by template backends. Although,
due to historical reasons, the Django template language also internally uses
these exceptions, other exceptions specific to the DTL should not be added
here.
"""


class HTTPResponseWriteError(Exception):
    """
    The exception used for syntax errors during parsing or rendering.
    """
    pass
