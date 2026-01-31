import logging
import sys
import os

def setup_logger():
    logger = logging.getLogger("app")
    LOG_LEVEL = os.getenv("LOGLEVEL", "INFO").upper()
    logger.setLevel(LOG_LEVEL)

    if logger.handlers:
        return logger

    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] %(name)s - %(message)s"
    )

    handler.setFormatter(formatter)
    logger.addHandler(handler)

    return logger


logger = setup_logger()
