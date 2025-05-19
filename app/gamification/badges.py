def get_badge(points: int) -> str | None:
    if points >= 1000: return "Gold"
    elif points >= 500: return "Silver"
    elif points >= 100: return "Bronze"
    return None
