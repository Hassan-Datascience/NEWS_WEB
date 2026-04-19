from textblob import TextBlob
from app.utils.logger import get_logger
from app.models.processed import SentimentLabel

logger = get_logger(__name__)


def analyze_sentiment(text: str) -> tuple[SentimentLabel, float]:
    """
    Use TextBlob to compute polarity in [-1, 1].
    Map to label: positive >= 0.05, negative <= -0.05, else neutral.
    """
    try:
        blob = TextBlob(text)
        polarity: float = round(blob.sentiment.polarity, 4)
    except Exception as exc:
        logger.debug("TextBlob error: %s", exc)
        polarity = 0.0

    if polarity >= 0.05:
        label: SentimentLabel = "positive"
    elif polarity <= -0.05:
        label = "negative"
    else:
        label = "neutral"

    return label, polarity
