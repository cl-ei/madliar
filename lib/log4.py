import os
import logging
from etc.config import LOG_PATH

__all__ = ("logger", )

logger = logging.getLogger("madliar")
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler(os.path.join(LOG_PATH, "madliar.log"))
formatter = logging.Formatter('%(levelname)s %(asctime)s %(filename)s:%(lineno)d:%(funcName)s %(message)s')
fh.setFormatter(formatter)
logger.addHandler(fh)
