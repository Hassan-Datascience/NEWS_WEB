import re
from collections import Counter

_STOP_WORDS: frozenset[str] = frozenset(
    {
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "is", "was", "are", "were", "be", "been",
        "has", "have", "had", "will", "would", "could", "should", "may", "might",
        "do", "did", "does", "not", "no", "it", "its", "this", "that", "these",
        "those", "i", "we", "he", "she", "they", "you", "my", "our", "your",
        "his", "her", "their", "what", "which", "who", "how", "when", "where",
        "why", "all", "as", "up", "out", "so", "if", "about", "into", "then",
        "than", "also", "after", "before", "over", "just", "more", "new",
        "removed", "content", "chars", "said", "says", "according",
    }
)

_TOKEN_RE = re.compile(r"[a-zA-Z]{3,}")  # only alphabetic tokens >= 3 chars


def tokenize(text: str) -> list[str]:
    """Lowercase-tokenize text and remove stop words."""
    tokens = _TOKEN_RE.findall(text.lower())
    return [t for t in tokens if t not in _STOP_WORDS]


def extract_keywords(text: str, top_n: int = 10) -> list[str]:
    """Return top N most frequent meaningful tokens."""
    tokens = tokenize(text)
    if not tokens:
        return []
    most_common = Counter(tokens).most_common(top_n)
    return [word for word, _ in most_common]
