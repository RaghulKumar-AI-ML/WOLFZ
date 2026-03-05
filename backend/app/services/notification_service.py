import logging


logger = logging.getLogger(__name__)


def push_notification(user_id: int, message: str) -> None:
    logger.info('notification queued user_id=%s message=%s', user_id, message)
