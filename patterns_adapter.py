def normalize_target(value):
    s = str(value or "").upper()
    if s in {"A", "AZUL", "BLUE", "🔵"}:
        return "A"
    if s in {"R", "VERMELHO", "RED", "🔴"}:
        return "R"
    return None

def load_patterns(path="patterns.json"):
    import json
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
