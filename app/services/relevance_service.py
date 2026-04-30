from app.config.relevance_keywords import BDM_KEYWORDS


def calculate_relevance_score(title: str | None):
    if not title:
        return 0

    title_lower = title.lower()
    score = 0

    for keyword in BDM_KEYWORDS:
        if keyword.lower() in title_lower:
            score += 1

    return score
